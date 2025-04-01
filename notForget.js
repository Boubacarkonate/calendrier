document.addEventListener("DOMContentLoaded", () => {
    let principalCalendar = document.getElementById('principal-calendar');


    const miniCalendar = document.getElementById('mini-calendar');
    const filters = document.getElementById('filters');
    const filterName = document.getElementById('filter-name');
    const filterBilan = document.getElementById('filter-bilan');

    let eventTitleInput = document.getElementById('event-title');
    let eventDateInput = document.getElementById('event-date');
    let eventStartInput = document.getElementById('event-start');
    let eventEndInput = document.getElementById('event-end');
    let saveEventBtn = document.getElementById('save-event');


    const openModalBtn = document.getElementById('open-modal');
    // const addEventModal = new bootstrap.Modal(document.getElementById('addEventModal'));

    const btnCreateEvent = document.getElementById('create-event');
    const inputSearchContacts = document.getElementById('inputSearchContacts');

    const dateToString = (date) => {
        m = date.getMonth() + 1
        d = date.getDate()
        return date.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
    }


    // Création d'un événement test en statique 
    let eventCreated = [
        { title: 'test1 événement créé', start: '2025-03-24T09:00:00', end: '2025-03-25T09:00:00' },
        { title: 'test2 événement créé', start: '2025-03-24T09:00:00', end: '2025-03-24T09:00:00' },
        { title: 'test3 événement créé', start: '2025-03-24T09:00:00', end: '2025-03-24T09:00:00' },
        { title: 'test4 événement créé', start: '2025-03-24T09:00:00', end: '2025-03-24T09:00:00' },
        { title: 'test5 événement créé', start: '2025-03-24T09:00:00', end: '2025-03-24T09:00:00' },
        { title: 'test6 événement créé', start: '2025-03-24T09:00:00', end: '2025-03-24T09:00:00' }
    ];

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
            mainCalendar.changeView('timeGridWeek', info.dateStr);
        }
    });

    smallCalendar.render();

    // Calendrier Principal
    let mainCalendar = new FullCalendar.Calendar(principalCalendar, {
        initialView: 'timeGridWeek', // initialisation du calendrier par semaine
        allDayText: '', // suppression "all-day"
        firstDay: 1,  //commencer l'affichage de la semaine à partir de lundi
        showNonCurrentDates: false,
        // slotMinTime: '00:00:00',
        // scrollTime: "08:00:00", par défaut le calendrier commence à 8h
        locale: 'fr', // Date en français
        selectable: true, // Permet de sélectionner des dates
        editable: true, // Permet d'éditer/déplacer les événements
        scrollTimeReset: false, // 	Reste sur l'heure scrollée ou non
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
        // contentHeight: 'auto',    // Ajuste automatiquement la hauteur du contenu
        expandRows: true,         // Étire les cellules pour éviter les espaces vides
        aspectRatio: 1.35,
        eventLimit: 3, // Limite le nombre d'événements par jour
        eventLimitText: 'plus', // Texte pour les événements supplémentaires

        events: eventCreated,
        // events: [],

        eventDidMount: function (info) {
            // Ajoute d'un tooltip Bootstrap pour chaque événement au hover
            info.el.setAttribute("title", info.event.title);
            new bootstrap.Tooltip(info.el, {
                placement: "auto",
                trigger: "hover",
            });
        },

        // Synchronisation avec le mini calendrier
        dateClick: function (info) {
            // Mettre à jour la vue du mini calendrier
            smallCalendar.gotoDate(info.dateStr);
        
            // Afficher la boîte de dialogue avec un formulaire amélioré
            displayConfirmDialog(
                `<div class="mb-3">
                    <label for="event-title">Titre :</label>
                    <input type="text" id="event-title" class="form-control form-control-sm" placeholder="Nom de l'événement" aria-label="Nom de l'événement">
                </div>
                <div class="mb-3">
                    <label for="event-date">Date :</label>
                    <input type="date" id="event-date"  class="form-control form-control-sm" placeholder="Date de l'événement" aria-label="Date de l'événement" value="${dateToString(info.date)}">
                </div>
                <div class="mb-3">
                    <label for="event-start">Heure de début :</label>
                    <input type="time" id="event-start" class="form-control form-control-sm" placeholder="Heure de début" aria-label="Heure de début">
                </div>
                <div class="mb-3">
                    <label for="event-end">Heure de fin :</label>
                    <input type="time" id="event-end" class="form-control form-control-sm" placeholder="Heure de fin" aria-label="Heure de fin">
                </div>
                    <div class="mb-3">
                    <label for="event-color">Choix de la couleur de l'événement :</label>
                <input type="color" class="form-control form-control-color" id="event-color" value="#563d7c">
                </div>
                `,
                400,
                "Ajouter un événement",
                true,
                false,
                600,
                function () { //  Si bouton confirmé
                    let title = document.getElementById('event-title').value;
                    let date = document.getElementById('event-date').value;
                    let startTime = document.getElementById('event-start').value;
                    let endTime = document.getElementById('event-end').value;
                    let color = document.getElementById('event-color').value;
                
                    // Vérification des champs obligatoires
                    if (!title) {
                        alert("Veuillez entrer un titre pour l'événement.");
                        return;
                    }
                    if (!startTime || !endTime) {
                        alert("Veuillez spécifier une heure de début et une heure de fin.");
                        return;
                    }
                    if (endTime <= startTime) {
                        alert("L'heure de fin doit être après l'heure de début.");
                        return;
                    }
        
                    // Formatage des dates et heures
                    let startDateTime = `${date}T${startTime}`;
                    let endDateTime = `${date}T${endTime}`;
        
                    
                    // Ajouter l'événement au calendrier principal
                    var newEvent = {
                        title: title,
                        start: startDateTime,
                        end: endDateTime,
                        backgroundColor: color
                    };

                    mainCalendar.addEvent(newEvent);
                    alert(color)
                    console.log("Événement ajouté :", newEvent);
                },
                function () { // Si bouton annulé
                    console.log("Ajout annulé");
                }
            );
        },
        

        // Configuration de l'affichage de l'événement
        eventContent: function (arg) {
            let title = document.createElement('div');
            title.style.fontWeight = 'bold';
            title.textContent = arg.event.title;

            let time = document.createElement('div');
            time.textContent = arg.timeText;

            let container = document.createElement('div');
            container.appendChild(title);
            container.appendChild(time);

            return { domNodes: [container] };
        },

        eventDrop: function (info) {
            if (!confirm("êtes vous sûr de vouloir modifier cet événement ?")) {
                console.log(info.revert()); //annule le déplacement et revient à son pt de départ
                console.log(info.event.start);
            }
        },

    });

    mainCalendar.render();



    // Synchronisation du mini calendrier avec le calendrier principal
    mainCalendar.on('datesSet', function (info) {
        smallCalendar.gotoDate(info.view.currentStart);
    });



    // création d'un événement avec le bouton créer
    // btnCreateEvent.addEventListener('click', () => {
    //     addEventModal.show();
    // })


    // créer un nouvel événement
    saveEventBtn.addEventListener('click', function () {
        let title = eventTitleInput.value;
        let date = eventDateInput.value;
        let startTime = eventStartInput.value;
        let endTime = eventEndInput.value;
    
        if (!title || !date || !startTime || !endTime) {
            alert("Veuillez remplir tous les champs !");
            return;
        }
    
        let startDateTime = `${date}T${startTime}:00`; // Format complet
        let endDateTime = `${date}T${endTime}:00`;
    
        if (new Date(endDateTime) <= new Date(startDateTime)) {
            alert("L'heure de fin doit être après l'heure de début !");
            return;
        }
    
        var newEvent = {
            title: title,
            start: startDateTime,
            end: endDateTime
        };
    
        // Ajoute l'événement au calendrier
        mainCalendar.addEvent(newEvent);
    
        // Fermer la modal
        setTimeout(() => {
            addEventModal.hide();
        }, 300);
    
        // Réinitialiser les champs du formulaire
        eventTitleInput.value = '';
        eventDateInput.value = '';
        eventStartInput.value = '';
        eventEndInput.value = '';
    
        console.log("Événement ajouté :", newEvent);
    });
    


    // // déplacer la modal
    // $(document).ready(function () {
    //     $("#addEventModal").draggable({
    //         // handle: ".modal-header"
    //     });
    // });

    // $(() => {
    //     $('#addEventModal').resizable();
    // })

 
   
    
    

});

/*Ne PAS OUBLIER : manipuler les autres éléments malgré la maodal */


