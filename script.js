document.addEventListener("DOMContentLoaded", () => {


   // Affiche la modal de la gestion des calendriers
   $(function () {
       $("#openGestionCalendriers").click(function () {
           $.ajax({
               url: "/uxcalendrier/gestioncalendrier",
               method: "GET",
               success: function (data) {
                   displayConfirmDialog(
                       data,
                       800,
                       "Gérer les calendriers",
                       true,
                       false,
                       "auto",
                       function () {
                           console.log("Modifications enregistrées");
                       },
                       function () {
                           console.log("Annulation");
                       }
                   );
                   setTimeout(() => {
                       $(".ui-dialog").last().css({
                           top: "200px",

                       });
                   }, 0);
               }
           });
       });
   });

   $(function () {
       $("#openGestionCalendriers1").click(function () {
           $.ajax({
               url: "/uxcalendrier/gestioncalendrier",
               method: "GET",
               success: function (data) {
                   displayConfirmDialog(
                       data,
                       800,
                       "Gérer les calendriers",
                       true,
                       false,
                       "auto",
                       function () {
                           console.log("Modifications enregistrées");
                       },
                       function () {
                           console.log("Annulation");
                       }
                   );
                   setTimeout(() => {
                       $(".ui-dialog").last().css({
                           top: "200px",

                       });
                   }, 0);
               }
           });
       });
   });



})



function addToFiltersList(event) {
   if (event.source.id !== 'default') return;

   const filtersList = document.getElementById('filtres_calendrier');
   if (!filtersList) return; // Évite l'erreur si la div n'existe pas encore

   const K = event.extendedProps.K;
   if (filtersList.querySelector(`input[value="${K}"]`) !== null) return;

   const checkbox = document.createElement('input');
   checkbox.type = 'checkbox';
   checkbox.id = `filtre_${K}`;
   checkbox.value = K;
   checkbox.addEventListener('click', updateFilters);

   const span = document.createElement('span');
   span.classList.add('contact');
   filtersList.appendChild(span);

   const div_image = document.createElement('div');
   const rnd = Math.floor(Math.random() * 9) + 1;
   div_image.classList.add('contact-image', 'couleur' + rnd);
   span.appendChild(div_image);
   span.appendChild(checkbox);

   const label = document.createElement('label');
   label.htmlFor = checkbox.id;
   label.innerText = event.extendedProps.ident;
   span.appendChild(label);
}

var filteredKs = [];
function updateFilters() {
   const filtersList = document.getElementById('filtres_calendrier');
   filteredKs = [];

   if (!filtersList) return;

   filtersList.querySelectorAll('input[id^=filtre_]:checked').forEach(checkbox => {
       filteredKs.push(checkbox.value);
   });

   filterEvents();
}

function filterEvents() {
   if (!calendar || typeof calendar.getEvents !== 'function') {
       console.warn("Le calendrier n'est pas encore prêt.");
       return;
   }

   calendar.getEvents().forEach(event => checkEventFilter(event));
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
   console.log("Checkbox source modifiée !");
   sourceFilters = {}
   document.querySelectorAll('#sources_calendrier input[type="checkbox"]')
       .forEach(input => sourceFilters[input.value] = input.checked)
   filterSources()
   console.log('Source filters:', sourceFilters)
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


$(document).ready(function () {

   $(document).on("change", "#sources_calendrier input[type='checkbox']", function () {
       updateSrcFilters();
   });


   $(document).on("change", "#selectajout", function () {
       const q = $("#selectajout option:selected").data("tkna");
       if (q == undefined) return $("#selectk").removeClass('visible');
       $(`label[for="choixk"]`).text(q + " :");
       rechercheAstk($("#selectajout option:selected").data("typek"));
       $("#selectk").addClass('visible');
   });

   $('#ajoutfiche').on("click", function () {

       const template = document.getElementById("ajoutFicheTemplate");
       const modalClone = template.content.cloneNode(true);

       const modalContainer = $("<div>").append(modalClone);

       modalContainer.find("#ajoutFicheModal").attr("id", "ajoutFicheModal_" + Date.now());

       const dateInput = modalContainer.find("#ajout_evenementdate");
       if (dateInput.length) {
           const info = { date: new Date() };
           dateInput.val(info.date.toISOString().split('T')[0]);
       }


       displayConfirmDialog(
           modalContainer[0],
           600,
           "Ajouter une nouvelle fiche évènement",
           true,
           false,
           "auto",
           function () {

               modalContainer.find("#newevent").trigger("click");
           },
           function () {
               console.log("Ajout annulé");
           }
       );
   });

   $(document).on("click", "#btnsrc", function () {

       if ($("#ajoutFicheModal").length === 0) {

           $("body").append($("#ajoutFicheTemplate").html());
       }


       $("#ajoutFicheModal").show();
   });

   $(document).on("input", "#rechchoixk", function () {
       rechercheAstk($("#selectajout option:selected").data("typek"));
   });

   $(document).on("click", "#newevent", function () {
       const cell = document.getElementById("ajout_evenement");
       if (!Array.from(cell.elements).reduce((a, c) => a && c.reportValidity(), true)) return;

       const params = {
           K: $("#choixk").val(),
           N: $("#selectajout").val()
       }
       const vr = $("#selectajout option:selected").data("vr");
       const data = {
           'NRstatutaction': 'Prévu',
           [`${vr}[id]`]: '',
           [`${vr}[date]`]: $("#ajout_evenementdate").val(),
           [`${vr}[titre]`]: $("#ajout_evenementtitle").val(),
           [`${vr}[deb]`]: $("#ajout_evenementstart").val(),
           [`${vr}[fin]`]: $("#ajout_evenementend").val(),
           [`${vr}[couleur]`]: $("#ajout_evenementcolor").val()
       };

       $.ajax({
           type: "POST",
           url: `/uxfiche/modif/K/${params.K}/N/${params.N}`,
           dataType: "html",
           data: data,
           success: function () {
               calendar.getEventSourceById('default').refetch();
           },
           error: function (resultat, statut, erreur) {
               traiteRetourErreurAjax2("ajoutficheevenement", resultat, statut, erreur);
           }
       });

       // Réinitialisation des champs
       $('#selectajout').val('');
       $('#choixk').val('');
       $("#selectk").removeClass('visible');
       $('#ajout_evenementtitle').val('');
       $('#ajout_evenementdate').val('');
       $('#ajout_evenementstart').val('');
       $('#ajout_evenementend').val('');
       $('#ajout_evenementcolor').val('');
   });

   // Gérer la sélection globale des filtres
   $("input#selecttoutcb").on("change", function () {
       if ($(this).is(':checked')) {
           $("div#filtres_calendrier span.contact:visible input[type=checkbox][id^='filtre']").prop("checked", true);
       } else {
           $("div#filtres_calendrier span.contact:visible input[type=checkbox][id^='filtre']").prop("checked", false);
       }
       updateFilters();
   });

   // Événement de recherche dans les filtres
   $("#rechcheckboxlist").on("input", function () {
       let valrech = sansaccent($(this).val()).toLowerCase();
       $("#filtres_calendrier span.contact:not('.selecttout') label").each(function (ilib, dlib) {
           let valcb = sansaccent($(dlib).text()).toLowerCase();
           if (valcb.match(valrech) == null) {
               $(dlib).parent().hide();
           } else {
               $(dlib).parent().show();
           }
       });
   });


   const searchBar = document.getElementById("search-bar");
   const popupFilter = document.getElementById('filtres_calendrier');
   const btnSearchValidate = document.getElementById("btnSearchValidate");





   $(function () {
       $("#btn-filter").click(function () {
           filterIndividu()
       })
   });

   const filterIndividu = () => {
       displayConfirmDialog(
           popupFilter,
           600,
           "Filtrer les individus",
           true,
           false,
           "auto",
           function () {

               renderSelectedFilters();

           },
           function () {

               $("#rechcheckboxlist").val('');


               $("#filtres_calendrier span.contact:not('.selecttout') label").each(function (_, dlib) {
                   $(dlib).parent().show();
               });
               const filterEventDiv = document.getElementById("filterEvenement");

               filterEventDiv.innerHTML = '';
               refreshCalendarFilters();
           }
       );
   }

   function renderSelectedFilters() {
       const filterEventDiv = document.getElementById("filterEvenement");
       const accordionCollapse = document.getElementById("panelsStayOpen-collapseTwo");

       filterEventDiv.innerHTML = '';

       const addedLabels = new Set();

       let isFilterActive = false;  

       $("#filtres_calendrier span.contact:visible input[type=checkbox]:checked").each(function () {
           const inputId = $(this).attr("id");
           const labelText = $(`label[for="${inputId}"]`).text();

           if (!addedLabels.has(labelText)) {
               addedLabels.add(labelText);

               const labelElement = $("<div>")
                   .addClass("filter-item d-inline-block me-2 mb-2 px-2 py-1 bg-light border rounded")
                   .text(labelText);

               filterEventDiv.appendChild(labelElement[0]);
               isFilterActive = true;
           }
       });

       if (isFilterActive) {

           $(accordionCollapse).addClass("show");
       } else {

           $(accordionCollapse).removeClass("show");
       }

       updateFilters();
   }





   $("#filtres_calendrier").on("change", "input[type=checkbox]", function () {
       renderSelectedFilters();
   });


   $("input#selecttoutcb").on("change", function () {
       const check = $(this).is(':checked');
       $("div#filtres_calendrier span.contact:visible input[type=checkbox][id^='filtre']").prop("checked", check);
       renderSelectedFilters();
   });


   $("#rechcheckboxlist").on("input", function () {
       let valrech = sansaccent($(this).val()).toLowerCase();
       $("#filtres_calendrier span.contact:not('.selecttout') label").each(function (_, dlib) {
           let valcb = sansaccent($(dlib).text()).toLowerCase();
           $(dlib).parent().toggle(valcb.includes(valrech));
       });
   });

   function refreshCalendarFilters() {
       $("#filtres_calendrier span.contact:not(.selecttout)").remove(); // Nettoyage avant recréation
       const events = calendar.getEvents();
       const added = new Set();

       events.forEach(event => {
           const label = event.extendedProps.K; // ou une autre propriété
           const id = `filtre-${event.extendedProps.K}`;

           if (!added.has(label) && $(`#${id}`).length === 0) {
               added.add(label);
               const checkboxHtml = `
                   <span class="contact">
                       <input type="checkbox" id="${id}" checked>
                       <label for="${id}">${label}</label>
                   </span>
               `;
               $("#filtres_calendrier").append(checkboxHtml);
           }
       });

       renderSelectedFilters();
   }



   $(document).ready(function () {
       renderSelectedFilters();
   });


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


   // ///////////////////////////////////////////////

   $(document).ready(function () {
       $('#toggleSidebar').on('click', function () {
           $('#sidebar').toggleClass('hidden');


           if (typeof calendar !== 'undefined' && calendar.render) {
               setTimeout(() => {
                   calendar.render();
               }, 300);
           }
       });
   });


});














