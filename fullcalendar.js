var calendarSrc = {
    id: 'default',
    url: '/uxcalendrier/recupererevts',
    method: 'POST',
    startParam: 'datedebut',
    endParam: 'datefin'
}
var todoSrc = {
    id: 'todo',
    url: '/uxcalendrier/recupererevtstodo',
    method: 'POST',
    startParam: 'datedebut',
    endParam: 'datefin'
}
var calendar = null
var sources = [calendarSrc, todoSrc]
// let calendarReady = false;

function dateToSqlString(date) {
    m = date.getMonth() + 1
    d = date.getDate()
    return date.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
}

function loadCalendar() {

    const miniCalendar = document.getElementById('mini-calendar');
    // Mini Calendrier
    let smallCalendar = new FullCalendar.Calendar(miniCalendar, {
        initialView: 'dayGridMonth',
        locale: 'fr',
        dayHeaderFormat: { weekday: 'narrow' }, // Affiche seulement la première lettre du jour
        firstDay: 1,
        headerToolbar: {
            left: 'title',
            center: '',
            right: 'prev,next'
        },
        dateClick: function (info) {
            // au click de la date du dans le mini calendrier, le calendrier affiche cette date
            calendar.changeView('timeGridWeek', info.dateStr);
        }
    });

    smallCalendar.render();

    const el = document.getElementById('calme')
    if (el == null) return;
    calendar = new FullCalendar.Calendar(el, {

        initialView: 'timeGridWeek', // initialisation du calendrier par semaine
        eventSources: sources,
        allDayText: '', // suppression "all-day"
        firstDay: 1,  //commencer l'affichage de la semaine à partir de lundi
        showNonCurrentDates: false,
        locale: 'fr', // Date en français
        selectable: true, // Permet de sélectionner des dates
        editable: true, // Permet de déplacer les événements
        scrollTimeReset: false, // 	Reste sur l'heure scrollée ou non
        eventMinHeight: 40,  // Hauteur minimale pour tous les événements
        eventShortHeight: 50,  // Hauteur pour les événements courts (moins d’une heure)
        // Affichage des boutons
        headerToolbar: {
            left: 'today prev,next',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
            today: "Aujourd'hui",
            year: 'Année',
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour',
        },
        dayMaxEventRows: true, // Limites le nombre d'affichage d'événements dans la vue lorsqu'il y en a trop
        height: '80vh',          // Remplit tout l'écran
        expandRows: true,         // Étire les cellules pour éviter les espaces vides
        aspectRatio: 1.35,
        eventLimit: 4, // Limite le nombre d'événements par jour
        moreLinkContent: 'Voir +', // Texte pour les événements supplémentaires
        // Configuration de l'affichage de l'événement
        eventContent: function (arg) {
            // si on est dans la vue timeGridWeek
            if (arg.view.type === 'timeGridWeek') {
                let container = document.createElement('div');
                container.style.fontSize = '0.75rem'; 
                container.style.lineHeight = '1.2';
                container.style.overflow = 'hidden'; 
                container.style.whiteSpace = 'nowrap';
                container.style.textOverflow = 'ellipsis';
        
                let title = document.createElement('div');
                title.style.fontWeight = '600';
                title.textContent = arg.event.title;
        
                let time = document.createElement('div');
                time.style.fontSize = '0.6rem';
                time.style.opacity = '0.9';
                time.textContent = arg.timeText;
        
                let name = document.createElement('div');
                name.style.fontSize = '0.75rem';
                name.style.opacity = '';
                name.textContent = arg.event.extendedProps.ident || '';
        
                container.appendChild(title);
                container.appendChild(time);
                container.appendChild(name);
        
                return { domNodes: [container] };
            }
        
            // Sinon le rendu par défaut
            return true;
        },
        
        eventDidMount: function (info) {
            addToFiltersList(info.event);
            checkEventFilter(info.event);
            checkEventSrcFilter(info.event);
            updateFilters(info.event)
        },
       
        eventDrop: async function (info) {
            const event = info.event;

            const template = document.getElementById("modificationFicheTemplate");
            const modalClone = template.content.cloneNode(true);
            const tempContainer = document.createElement("div");
            tempContainer.appendChild(modalClone);

            const cell = tempContainer.querySelector("#modifFiche");

            if (!cell) {
                console.error("Élément #modifFiche non trouvé dans le clone");
                return;
            }

            function modifchamps(dis, disp_style) {
                cell.querySelector(`input[name='calmemodif[titre]']`).disabled = dis;
                cell.querySelector(`input[name='calmemodif[date]']`).disabled = dis;
                cell.querySelector(`input[name='calmemodif[deb]']`).disabled = dis;
                cell.querySelector(`input[name='calmemodif[fin]']`).disabled = dis;
                cell.querySelector(`input[name='calmemodif[couleur]']`).disabled = dis;
                cell.querySelector(`div.calmemodifbt`).style.display = disp_style;
            }

            modifchamps(true, 'none');

            function saveFicheModification() {
                saveZfcaldavevent('calmemodif');
            }

            const formatHeure = (date) => date.toTimeString().substring(0, 5);

            try {
                let data = null;
                if (event.source.id === 'default') {
                    data = await getEvent(event.id);
                    if (data !== false) {

                        loadZfcaldavevent(cell, data);
                        cell.querySelector(`.champlabel`).innerHTML = `<a href="/uxtdbk?K=${data.K}" target="_blank">${data.ident}</a>`;
                        cell.querySelector(`input[name='calmemodif[id]']`).value = data.id;
                        cell.querySelector(`a#calmemodiflink`).href = data.link;
                    }
                } else if (event.source.id === 'todo') {
                    data = await getEventTodo(event.id, event.extendedProps.K);
                    if (data !== false) {
                        loadZfcaldavevent(cell, data);
                        cell.querySelector(`.champlabel`).innerHTML = `<a href="${data.link}" target="_blank">Todo : ${data.ident}</a>`;
                        cell.querySelector(`input[name='calmemodif[id]']`).value = data.id;
                    }
                } else {
                    let color = event.el.className.includes('fc-daygrid-block-event') ? event.el.style.borderColor : event.el.firstChild.style.borderColor;
                    const rgbtohex = (rgb) => rgb.indexOf('rgb') !== 0 ? rgb : '#' + rgb.match(/\d+/g).map(x => (+x).toString(16).padStart(2, '0')).join('');

                    data = {
                        title: event.title,
                        start: dateToSqlString(event.start) + ' ' + formatHeure(event.start),
                        end: event.end ? dateToSqlString(event.end) + ' ' + formatHeure(event.end) : '',
                        color: rgbtohex(color),
                        tag: ''
                    };

                    loadZfcaldavevent(cell, data);
                    cell.querySelector(`.champlabel`).innerHTML = `<span>Source externe</span>`;
                    cell.querySelector(`input[name='calmemodif[id]']`).value = '';
                    cell.querySelector(`a#calmemodiflink`).removeAttribute('href');
                }


                if (event.start) {
                    cell.querySelector(`input[name='calmemodif[date]']`).value = dateToSqlString(event.start);
                    cell.querySelector(`input[name='calmemodif[deb]']`).value = formatHeure(event.start);
                }
                if (event.end) {
                    cell.querySelector(`input[name='calmemodif[fin]']`).value = formatHeure(event.end);
                }


                displayConfirmDialog(
                    tempContainer,
                    500,
                    "Confirmer la modification",
                    true,
                    false,
                    "auto",
                    function () {
                        saveFicheModification();

                    },
                    function () {

                        info.revert();
                    }
                );

            } catch (err) {
                console.error("Erreur lors du chargement ou de la sauvegarde :", err);
                info.revert();
            }
        },
        eventAdd: function(info) {
            addToFiltersList(info.event);
        },
        eventChange: function(info) {
            addToFiltersList(info.event);
        },
        dateClick: function (info) {
            const template = document.getElementById("ajoutFicheTemplate");
            const modalClone = template.content.cloneNode(true);

            const modalContainer = $("<div>").append(modalClone);

            modalContainer.find("#ajoutFicheModal").attr("id", "ajoutFicheModal_" + Date.now());


            const dateInput = modalContainer.find("#ajout_evenementdate");
            if (dateInput.length) {
                dateInput.val(dateToSqlString(info.date));
            }


            displayConfirmDialog(
                modalContainer[0],
                600,
                "Ajouter un nouvel évènement",
                true,
                false,
                'auto',
                function () {

                    modalContainer.find("#newevent").trigger("click");
                },
                function () {
                    console.log("Ajout annulé");
                }
            );

setTimeout(() => {
    $(".ui-dialog").last().css({
        top: "200px",
       
    });
}, 0);
        },
        eventMouseEnter: function (info) {
            info.jsEvent.preventDefault()

            //afficher infobulle
        },
        eventMouseLeave: function (info) {
            info.jsEvent.preventDefault()
            //cacher infobulle
        },
        eventClick: async function (info) {
            info.jsEvent.preventDefault();

            const template = document.getElementById("modificationFicheTemplate");
            const modalClone = template.content.cloneNode(true);

            const tempContainer = document.createElement("div");
            tempContainer.appendChild(modalClone);


            const cell = tempContainer.querySelector("#modifFiche");

            if (!cell) {
                console.error("Élément #modifFiche non trouvé dans le clone");
                return;
            }


            function modifchamps(dis, disp_style) {
                cell.querySelector(`input[name='calmemodif[titre]']`).disabled = dis;
                cell.querySelector(`input[name='calmemodif[date]']`).disabled = dis;
                cell.querySelector(`input[name='calmemodif[deb]']`).disabled = dis;
                cell.querySelector(`input[name='calmemodif[fin]']`).disabled = dis;
                cell.querySelector(`input[name='calmemodif[couleur]']`).disabled = dis;
                // cell.querySelector(`button[title='Enregistrer']`).disabled = dis;
                cell.querySelector(`div.calmemodifbt`).style.display = disp_style;
            }

            modifchamps(true, 'none');

            // Fonction pour charger les données dans la modal et afficher
            // function loadModalData(eventData) {
            //     // Charger les données dans le template cloné
            //     tempContainer.querySelector('.champlabel').innerHTML = `<a href="/uxtdbk?K=${eventData.K}" target="_blank">${eventData.ident}</a>`;
            //     tempContainer.querySelector("input[name='calmemodif[id]']").value = eventData.id;
            //     tempContainer.querySelector("a#calmemodiflink").href = eventData.link;

            //     // Activer les champs et afficher le bouton "Enregistrer"
            //     modifchamps(false, 'flex');
            // }
            function saveFicheModification() {
                saveZfcaldavevent('calmemodif');
            }
            displayConfirmDialog(
                tempContainer,
                500,
                "Modifier l'événement",
                true,
                false,
                "auto",
                function () {
                    saveFicheModification();
                    console.log("Événement modifié");

                },
                function () {
                    console.log("Modification annulée");
                }
            );
            setTimeout(() => {
                $(".ui-dialog").last().css({
                    top: "200px", 
                });
            }, 0);

            // Récupéreration des données de l'événement selon la source
            switch (info.event.source.id) {
                case 'default':
                    const data = await getEvent(info.event.id)
                    if (data !== false) {
                        loadZfcaldavevent(cell, data)
                        cell.querySelector(`.champlabel`).innerHTML = `<a href="/uxtdbk?K=${data.K}" target="_blank">${data.ident}</a>`
                        cell.querySelector(`input[name='calmemodif[id]']`).value = data.id
                        cell.querySelector(`a#calmemodiflink`).href = data.link
                        modifchamps(false, 'flex');
                    }
                    break;
                case 'todo':
                    const dataTodo = await getEventTodo(info.event.id, info.event.extendedProps.K)
                    if (dataTodo !== false) {
                        loadZfcaldavevent(cell, dataTodo)
                        if (Number.isInteger(dataTodo.K))
                            cell.querySelector(`.champlabel`).innerHTML = `<a href="${dataTodo.link}" target="_blank">Todo : ${dataTodo.ident}</a>`
                        else
                            cell.querySelector(`.champlabel`).innerHTML = `<a href="${dataTodo.link}" target="_blank">Todo : ${dataTodo.ident}</a>`
                        cell.querySelector(`input[name='calmemodif[id]']`).value = dataTodo.id
                    }
                    break;
                default:
                    let componentToHex = (val) => {
                        const a = Number(val).toString(16);
                        return a.length === 1 ? "0" + a : a;
                    }
                    let rgbtohex = (rgb) => {
                        if (rgb.indexOf('rgb') !== 0)
                            return rgb
                        return '#' + rgb
                            .match(/\d+/g)
                            .map(componentToHex)
                            .join('');
                    }

                    let color = info.el.className.includes('fc-daygrid-block-event') ? info.el.style.borderColor : info.el.firstChild.style.borderColor
                    const obj = {
                        title: info.event.title,
                        start: dateToSqlString(info.event.start) + ' ' + info.event.start.toTimeString().substring(0, 5),
                        end: dateToSqlString(info.event.end) + ' ' + info.event.end.toTimeString().substring(0, 5),
                        color: rgbtohex(color),
                        tag: ''
                    }

                    loadZfcaldavevent(cell, obj)
                    cell.querySelector(`.champlabel`).innerHTML = `<span>Source externe</span>`
                    cell.querySelector(`input[name='calmemodif[id]']`).value = ''
                    cell.querySelector(`a#calmemodiflink`).removeAttribute('href')
                    break;
            }
        }


    })
    calendar.render();
    // calendarReady = true;
  
}

if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", loadCalendar)
else loadCalendar()
