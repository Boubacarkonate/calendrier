let principalCalendar = document.getElementById('principalCalendar');
const miniCalendar = document.getElementById('miniCalendar');
const filters = document.getElementById('filters');
const filterName = document.getElementById('filterName');
const filterBilan = document.getElementById('filterBilan');
let addEventModal = new bootstrap.Modal(document.getElementById('addEventModal'));
let eventTitleInput = document.getElementById('event-title');
let eventDateInput = document.getElementById('event-date');
let saveEventBtn = document.getElementById('save-event');

document.addEventListener('DOMContentLoaded', () => {
    let mainCalendar = new FullCalendar.Calendar(principalCalendar, {
        dayMaxEventRows: true, // for all non-TimeGrid views
        views: {
            timeGrid: {
              dayMaxEventRows: 3 // adjust to 6 only for timeGridWeek/timeGridDay
            }
          },
        
        initialView: 'dayGridMonth',   // Vue par défaut : mois
        locale: 'fr',                  // date en français
        selectable: true,              // Permet la sélection des dates
        editable: true,                // Permet d'éditer/déplacer les événements
        droppable: true,               // Permet de glisser-déposer des événements externes
        // Affichage des boutons
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay'
        },

        // Traductions des boutons affichés
        buttonText: {
            today: "Aujourd'hui",
            year: 'Année',
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour',
        },

        eventDidMount: function (info) {
            // 🟢 Ajoute un tooltip Bootstrap pour chaque événement
            info.el.setAttribute("title", info.event.title);
            new bootstrap.Tooltip(info.el, {
                placement: "top",
                trigger: "hover"
            });
        },

        moreLinkDidMount: function (info) {
            // 🔵 Ajoute un popover Bootstrap au "+X more"
            let events = info.segs.map(seg => `<li>${seg.event.title}</li>`).join("");
            let content = `<ul class="list-unstyled mb-0">${events}</ul>`;

            let popover = new bootstrap.Popover(info.el, {
                html: true,
                content: content,
                trigger: "hover",
                placement: "auto"
            });

            info.el.setAttribute("data-bs-toggle", "popover");
            info.el.setAttribute("data-bs-content", content);
        },

        dateClick: function (info) {
            eventTitleInput.value = "";
            eventDateInput.value = info.dateStr + "T12:00";
            addEventModal.show();
        },

        eventDrop: function (info) {
            updateLocalStorage();
        },

        eventResize: function (info) {
            updateLocalStorage();
        },

        height: '100vh',          // Remplit tout l'écran
        contentHeight: 'auto',    // Ajuste automatiquement la hauteur du contenu
        expandRows: true,         // Étire les cellules pour éviter les espaces vides
        aspectRatio: 1.35,        // Largeur similaire à Google Agenda

        // Limiter la hauteur des événements pour éviter qu'ils débordent
        eventMaxHeight: 80,       // Limite la hauteur des événements

        // Gestion du débordement d'événements
        eventLimit: 3,            // Montre un maximum de 3 événements par jour, le reste sera dans un "more" (un bouton pour voir plus d'événements)
        eventLimitText: 'plus',   // Texte du bouton pour voir plus d'événements
    });

    // Rendu du calendrier
    mainCalendar.render();

    // Ajout de l'événement lorsque le bouton est cliqué
    saveEventBtn.addEventListener('click', function () {
        if (eventTitleInput.value && eventDateInput.value) {
            var newEvent = {
                title: eventTitleInput.value,
                start: eventDateInput.value
            };

            mainCalendar.addEvent(newEvent); // Ajoute l'événement au calendrier
            saveEventToLocalStorage(newEvent); // Sauvegarde l'événement dans le localStorage
            addEventModal.hide(); // Cache le modal
        }
    });
});

// Fonction pour sauvegarder l'événement dans le localStorage
function saveEventToLocalStorage(event) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));
}
