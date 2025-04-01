function addToFiltersList(event) {
    if (event.source.id !== 'default') return;
    const K = event.extendedProps.K
    const filtersList = document.getElementById('filtres_calendrier')
    if (filtersList.querySelector(`input[value="${K}"]`) !== null) return;
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.id = `filtre_${K}`
    checkbox.value = K
    checkbox.addEventListener('click', updateFilters)
    const span = document.createElement('span')
    span.classList.add('contact');
    filtersList.appendChild(span)
    const div_image = document.createElement('div')
    rnd = Math.floor(Math.random() * 9) + 1; // 9 different couleur in css
    div_image.classList.add('contact-image',"couleur"+rnd);
    span.appendChild(div_image)
    span.appendChild(checkbox)
    const label = document.createElement('label')
    label.htmlFor = checkbox.id
    label.innerText = event.extendedProps.ident
    span.appendChild(label)
    const i_check = document.createElement('i')
    i_check.classList.add("fas", "fa-check");
    span.appendChild(i_check)
}
var filteredKs = [];
function updateFilters() {
    const filtersList = document.getElementById('filtres_calendrier')
    filteredKs = []
    filtersList.querySelectorAll('input[id^=filtre_]:checked').forEach(checkbox => {
        filteredKs.push(checkbox.value)
    })
    filterEvents()
}
function filterEvents() {
    calendar.getEvents().forEach(event => checkEventFilter(event))
}
function checkEventFilter(event) {
    if (event.source.id !== 'default') return;
    if (filteredKs.length === 0) return event.setProp('display', 'auto')
    if (filteredKs.includes(event.extendedProps.K)) {
        event.setProp('display', 'auto')
    } else event.setProp('display', 'none')
}

var sourceFilters = {}
function updateSrcFilters() {
    sourceFilters = {}
    document.querySelectorAll('#sources_calendrier input[type="checkbox"]')
        .forEach(input => sourceFilters[input.value] = input.checked)
    filterSources()
}
function filterSources() {
    calendar.getEvents().forEach(event => checkEventSrcFilter(event))
}
function checkEventSrcFilter(event) {
    if (sourceFilters[event.source.id] === undefined) return;
    event.setProp('display', sourceFilters[event.source.id] ? 'auto' : 'none')
}

async function addsrcevent() {
    const cell = document.getElementById('newsrc')
    const url = cell.querySelector('input[name="url"]')
    if (!url.reportValidity()) return;
    const data = {
        titre: cell.querySelector('input[name="titre"]').value,
        couleur: cell.querySelector('input[name="couleur"]').value
    }
    if (data.titre == '') return cell.querySelector('input[name="titre"]').reportValidity();
    const res = await addSource(url.value, data)
    if (res !== false) window.location.reload();
}
async function modsrcevent(elm) {
    const cell = elm.parentNode
    const id = cell.getAttribute('data_sourceId')
    const data = {
        titre: cell.querySelector('input[name="titre"]').value,
        couleur: cell.querySelector('input[name="couleur"]').value
    }
    if (data.titre == '') return cell.querySelector('input[name="titre"]').reportValidity();
    const res = await updateSource(id, data)
    if (res !== false) window.location.reload();
}
async function delsrcevent(elm) {
    const cell = elm.parentNode
    const id = cell.getAttribute('data_sourceId')
    const res = await deleteSource(id)
    if (res !== false) window.location.reload();
}

async function reinitlink() {
    let pwd = ''
    if (!crypto.randomUUID) pwd = window.prompt('Entrer un mot de passe :')
    else pwd = crypto.randomUUID()
    const res = await updateLink(pwd)
    if (res !== false) document.querySelector('[name="lienprive"]').value = res
}
function accordion_open_close(accord) {
    const link                = accord;
    let link_parent           = link.parent();
    const last_child_li       = document.querySelector("ul.cal-menu").lastElementChild
    let parallel_active_links = link_parent.hasClass("active")
    if(last_child_li.classList.contains('active')){
        $(link_parent).removeClass("active");
        link_parent = $(document.querySelector("ul.cal-menu").firstElementChild)
        parallel_active_links = link_parent.hasClass("active")
    }
    if (!parallel_active_links) {
        link_parent.addClass('active')
        link_parent.children("div.cal-menu-content").slideDown()
    }
    link_parent.siblings().each(function () {
        $(this).removeClass("active");
    });
    link_parent.siblings().find("div.cal-menu-content").slideUp(function () { });
}
$(document).ready(function () {
    accordion_open_close($('li.cal-menu-child.active a'));
    $('#sources_calendrier input[type="checkbox"]').on("change", updateSrcFilters)
    $("#btnsrc").on("click", function () {
        $("div#gestion_sources").show()
    })

    $("#selectajout").on("change", function () {
        const q = $("#selectajout option:selected").data("tkna")
        if (q == undefined) { return $("#selectk").removeClass('visible'); } 
        $(`label[for="choixk"]`).text(q + " :")
        rechercheAstk($("#selectajout option:selected").data("typek"))
        $("#selectk").addClass('visible');
    })
    $("#rechchoixk").on("input", function () {
        rechercheAstk($("#selectajout option:selected").data("typek"))
    })
    $("#newevent").on("click", function () {
        const cell = document.getElementById("ajout_evenement")
        if (!Array.from(cell.elements).reduce((a, c) => a && c.reportValidity(), true)) return;
        const params = {
            K: $("#choixk").val(),
            N: $("#selectajout").val()
        }
        const vr = $("#selectajout option:selected").data("vr")
        const data = {
            'NRstatutaction': 'Prévu',
            [`${vr}[id]`]: '',
            [`${vr}[date]`]: $("#ajout_evenementdate").val(),
            [`${vr}[titre]`]: $("#ajout_evenementtitle").val(),
            [`${vr}[deb]`]: $("#ajout_evenementstart").val(),
            [`${vr}[fin]`]: $("#ajout_evenementend").val(),
            [`${vr}[couleur]`]: $("#ajout_evenementcolor").val()
        }
        $.ajax({
            type: "POST",
            url: `/uxfiche/modif/K/${params.K}/N/${params.N}`,
            dataType: "html",
            data: data,
            async: true,
            success: function () {
                calendar.getEventSourceById('default').refetch()
            }, error: function (resultat, statut, erreur) {
                traiteRetourErreurAjax2("ajoutficheevenement", resultat, statut, erreur);
            }
        })
        $('#selectajout').val('')
        $('#choixk').val('')
        $("#selectk").removeClass('visible');
        $('#selectajout').val('')
        $('#ajout_evenementtitle').val('')
        $('#ajout_evenementdate').val('')
        $('#ajout_evenementstart').val('')
        $('#ajout_evenementend').val('')
        $('#ajout_evenementcolor').val('')
    })

    $("#btnpublier").on("click", function () {
        if ($("#lienprive").css("visibility") === "hidden") {
            $("#lienprive").addClass("visible")
        }
    })

    $("#lienprive .fermerpopup").on("click", function () {
        $("#lienprive").removeClass("visible")
    })
    $("input#selecttoutcb").on("change", function(){
        if ($(this).is(':checked')) {
            $("div#filtres_calendrier span.contact:visible input[type=checkbox][id^='filtre']").prop("checked", true);
        }else{
            $("div#filtres_calendrier span.contact:visible input[type=checkbox][id^='filtre']").prop("checked", false);
        }
        updateFilters()
	});
    $("#rechcheckboxlist").on("input", function(){
		let valrech = sansaccent($(this).val()).toLowerCase();
        $("#filtres_calendrier span.contact:not('.selecttout') label").each(function(ilib, dlib){
            let valcb = sansaccent($(dlib).text()).toLowerCase();
            if(valcb.match(valrech) == null){
                $(dlib).parent().hide();
            } else {
                $(dlib).parent().show();
            }
        });	
	});

    $(".cal-menu-parent a").on('click' , function() {
         accordion_open_close($(this))
	})
})

function rechercheAstk(type) {
    let params = {
        K: null,
        N: null,
        liste: type,
        rech: $("#rechchoixk").val().toString(),
        vcs: {}
    };
    $.ajax({
        type: "POST",
        url: "/uxfiche/rechercherlistevolumineuse",
        dataType: "json",
        data: params,
        async: true,
        success: function (retour) {
            $("#choixk").find("option").remove();
            for (let i in retour.data) {
                const value = retour.data[i].libelle.split(" ");
                if (value[0] == "Aucun" || value[0] == "Affinez") {
                    $("<option>").val('').html(retour.data[i].code + " " + retour.data[i].libelle).appendTo($("#choixk"));
                } else {
                    $("<option>").val(retour.data[i].K).html(retour.data[i].code + " " + retour.data[i].libelle).appendTo($("#choixk"));
                }
            }
        }, error: function (resultat, statut, erreur) {
            traiteRetourErreurAjax2("rechercheListeVolumineuse", resultat, statut, erreur);
        }
    });
}
