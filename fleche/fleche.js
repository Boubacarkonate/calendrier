window.addEventListener('DOMContentLoaded', () => {
    function renderTimelineFromResponse(response) {
        const container = document.getElementById('timeline-widget');
        if (!container) {
            console.error('#timeline-widget manquant');
            return;
        }

        const groupes = response.groupes || [];
        const allFiches = response.projets || [];

        const groups = [];
        const items = [];
        let groupIdCounter = 1;
        let itemIdCounter = 1;

        // --- 1. Groupes classiques : fiches sans date de fin (date unique)
        groupes.forEach(ligne => {
            const groupId = groupIdCounter++;
            groups.push({
                id: groupId,
                content: ligne.nom_ligne || `Ligne ${ligne.ordre}`
            });

            (ligne.fiches || []).forEach(fiche => {
                const start = fiche.typefiche_date_debut || fiche.date_action;
                const end = fiche.typefiche_date_fin || null;

                if (!start || end) return; // garder uniquement sans date de fin

                const title = fiche.titre_action || fiche.typefiche || 'Sans titre';

                items.push({
                    id: itemIdCounter++,
                    group: groupId,
                    content: title,
                    start: start,
                    title: title,
                    className: 'conforme couleur-' + (fiche.couleur || 'default')
                });
            });
        });

        // --- 2. Groupes dynamiques pour fiches avec durée (date début ET date fin)
        const groupsByTypeK = {};
        allFiches.forEach(fiche => {
            const start = fiche.typefiche_date_debut || fiche.date_action;
            const end = fiche.typefiche_date_fin;

            if (!start || !end) return; // garder uniquement fiches avec durée

            const typeK = fiche.nom_affiche || fiche.typefiche_nomaffiche;
            if (!groupsByTypeK[typeK]) {
                groupsByTypeK[typeK] = {
                    id: groupIdCounter++,
                    content: typeK,
                    fiches: []
                };
            }
            groupsByTypeK[typeK].fiches.push(fiche);
        });

        Object.values(groupsByTypeK).forEach(group => {
            groups.push({
                id: group.id,
                content: group.content
            });

            group.fiches.forEach(fiche => {
                const nomAffiche = fiche.nom_affiche || fiche.typefiche_nomaffiche || 'Fiche sans nom';

                items.push({
                    id: itemIdCounter++,
                    group: group.id,
                    content: nomAffiche,
                    start: fiche.typefiche_date_debut || fiche.date_action,
                    end: fiche.typefiche_date_fin,
                    title: nomAffiche,
                    className: 'couleur-' + (fiche.couleur || 'default')
                });
            });
        });

        // --- création timeline
        if (window.timeline) {
            window.timeline.destroy();
        }

        window.timeline = new vis.Timeline(container);
        window.timeline.setOptions({
            stack: false,
            horizontalScroll: true,
            zoomKey: 'ctrlKey',
            editable: false,
            zoomable: true,
            showCurrentTime: true,
            tooltip: { followMouse: true, delay: 30 },
            margin: { item: 10, axis: 5 },
            align: "center",
            loadingScreenTemplate: function () {
                return "<h1>Loading...</h1>";
            },
        });

        const visGroups = new vis.DataSet(groups);
        const visItems = new vis.DataSet(items);
        window.timeline.setGroups(visGroups);
        window.timeline.setItems(visItems);

        // --- Filtres par checkbox (jquery)
        const originalItems = items.slice();
        const $filtersContainer = $('#timeline-filters');
        $filtersContainer.empty();

        groups.forEach(group => {
            const groupId = group.id;
            const label = $('<label>').css({ marginRight: '15px', display: 'inline-block' });
            const checkbox = $('<input type="checkbox" checked>')
                .attr('data-group-id', groupId)
                .on('change', function () {
                    const activeGroupIds = $filtersContainer.find('input[type="checkbox"]:checked')
                        .map(function () {
                            return parseInt($(this).data('group-id'));
                        }).get();

                    const filteredItems = originalItems.filter(item => activeGroupIds.includes(item.group));
                    window.timeline.setItems(new vis.DataSet(filteredItems));
                });

            label.append(checkbox).append(' ' + group.content);
            $filtersContainer.append(label);
        });
    }

    function getDataTypefiches() {
        const k = $('#uxtdbkLayout').data('k');
        if (!k) {
            $('#timeline-widget').text('Paramètre K manquant.');
            return;
        }

        $.ajax({
            type: "POST",
            url: "/uxtdbk/getdatafleche1",
            dataType: "json",
            data: { K: k },
            success: function (response) {
                renderTimelineFromResponse(response);
            },
            error: function (xhr, status, error) {
                console.error('Erreur AJAX:', status, error);
                $('#timeline-widget').text('Erreur de chargement des données. (' + xhr.status + ')');
            }
        });
    }

    $(document).ready(() => {
        getDataTypefiches();
    });
});






//     $.ajax({
//     type: "POST",
//     url: "/uxtdbk/testajax",
//     dataType: "json",
//     data: { nom: "Siham" },
//     success: function (retour) {
//         console.log("Succès AJAX:", retour);
//         $('#timeline-widget').text(retour.message);
//     },
//     error: function (xhr, status, error) {
//         console.error("Erreur AJAX:", status, error);
//         console.error("Code HTTP:", xhr.status);
//         console.error("Réponse:", xhr.responseText);
//         $('#timeline-widget').text("Erreur AJAX : " + error);
//     }
// });