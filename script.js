// const btnBack = document.querySelector('.back');
// const btnNext = document.querySelector('.next');
// const divMonth = document.querySelector('.month');

// //je crée un objet date à manipuler
// let today = new Date();


// let currentMonthIndex = today.getMonth(); // Obtenir le mois actuel sous forme d'index

// const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre' ];
// let monthCurrent = months[today.getMonth()];


// // Fonction pour afficher le mois actuel
// function updateMonthDisplay() {
//     let monthCurrent = months[currentMonthIndex]; // Récupérer le mois du tableau
//     console.log(monthCurrent); // Affiche le mois actuel
//     divMonth.innerHTML = ''
//         const span = document.createElement('span');
//     span.textContent = monthCurrent;
//     divMonth.appendChild(span);

//   }

// btnNext.addEventListener('click', () => {
//         currentMonthIndex++;
//         if (currentMonthIndex < 0) {
//           currentMonthIndex = 11; // Revenir à décembre
//         }
//         updateMonthDisplay();
     
//     })


// let monthCurrent2 = today.getMonth();
// const m = () => {

//     //je récupére le mois en toutes lettres en  français
//     let month = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(today);
    
//     /*
//     creation d'un span
//     dans le span je mets le mois
//     je mets le span dans la div
//     */
//     const span = document.createElement('span');
//     span.textContent = month;
//     divMonth.appendChild(span);
// }

// /*
// je crée la fonction du bouton next pour afficher un mois supplémentaire
// */
// // 
// btnBack.addEventListener('click', () => {
//     today.setMonth(today.getMonth() - 1);
//     m();

    
// })

// m()
// // updateMonthDisplay();




// <!DOCTYPE html>
// <html lang="fr">

// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Calendrier Indépendant</title>

//     <!-- Bootstrap 5 -->
//     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
//     <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

//     <!-- FullCalendar -->
//     <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>
//     <script src="https://cdn.jsdelivr.net/npm/@fullcalendar/interaction@6.1.15/index.global.min.js"></script>
//     <script src="https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid@6.1.15/index.global.min.js"></script>

//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             background-color: #f8f9fa;
//             margin: 0;
//             padding: 0;
//         }

//         .container-fluid {
//             display: flex;
//             height: 100vh;
//         }

//         #sidebar {
//             width: 300px;
//             background: white;
//             padding: 20px;
//             box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
//         }

//         #calendar-container {
//             flex-grow: 1;
//             padding: 20px;
//             background: white;
//         }

//         /* Style pour le mini-calendrier */
//         #mini-calendar {
//             max-width: 100%;
//             font-size: 0.75rem;
//             /* Réduire la taille du texte global */
//         }

//         /* Enlever toutes les bordures du mini-calendrier */
//         #mini-calendar .fc-daygrid {
//             border: none;
//             /* Enlever la bordure autour du calendrier */
//             margin: 0;
//             padding: 0;
//         }

//         /* Enlever les espaces internes des cellules du mini-calendrier */
//         #mini-calendar .fc-daygrid-day {
//             padding: 0;
//             /* Supprimer les espaces internes des cellules */
//             margin: 0;
//             /* Supprimer les marges autour des cellules */
//             border: none;
//             /* Enlever la bordure autour des cellules */
//             height: 30px;
//             /* Taille réduite des cellules */
//             width: 30px;
//             /* Taille réduite des cellules */
//         }

//         /* Centrer les dates dans les cellules du mini-calendrier */
//         #mini-calendar .fc-daygrid-day-number {
//             font-size: 0.75rem;
//             /* Taille réduite des numéros de jours */
//             text-align: center;
//             /* Aligner les dates au centre */
//             line-height: 30px;
//             /* Centrer verticalement le texte dans la cellule */
//             padding: 0;
//             /* Supprimer les espaces internes autour du texte */
//         }

//         /* Enlever les bordures de la table et les événements */
//         #mini-calendar td,
//         th {
//             border: none;
//             /* Supprimer les bordures de la table */
//             padding: 0;
//             /* Enlever les espaces autour des cellules de la table */
//             margin: 0;
//         }

//         /* Supprimer les événements du mini-calendrier */
//         #mini-calendar .fc-daygrid-day-events {
//             display: none;
//             /* Ne pas afficher les événements */
//         }

//         /* Supprimer la barre de titre */
//         #mini-calendar .fc-toolbar {
//             display: none;
//         }
//     </style>
// </head>

// <body>

//     <div class="container-fluid">
//         <!-- Sidebar avec mini calendrier -->
//         <div id="sidebar">
//             <h4>📅 Calendrier Indépendant</h4>

//             <!-- Mini calendrier -->
//             <div id="mini-calendar"></div>

//             <button id="open-modal" class="btn btn-primary w-100 mt-3">+ Ajouter un événement</button>
//             <hr>
//             <button id="btn-month" class="btn btn-light w-100 mt-2">Vue Mois</button>
//             <button id="btn-week" class="btn btn-light w-100 mt-2">Vue Semaine</button>
//             <button id="btn-day" class="btn btn-light w-100 mt-2">Vue Jour</button>
//         </div>

//         <!-- Calendrier principal -->
//         <div id="calendar-container">
//             <div id="calendar"></div>
//         </div>
//     </div>

//     <!-- Modal pour ajouter un événement -->
//     <div class="modal fade" id="addEventModal" tabindex="-1">
//         <div class="modal-dialog">
//             <div class="modal-content">
//                 <div class="modal-header">
//                     <h5 class="modal-title">Ajouter un événement</h5>
//                     <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
//                 </div>
//                 <div class="modal-body">
//                     <label for="event-title" class="form-label">Titre</label>
//                     <input type="text" id="event-title" class="form-control mb-2" placeholder="Nom de l'événement">

//                     <label for="event-date" class="form-label">Date</label>
//                     <input type="datetime-local" id="event-date" class="form-control mb-2">

//                     <button id="save-event" class="btn btn-success w-100">Enregistrer</button>
//                 </div>
//             </div>
//         </div>
//     </div>

//     <script>
//         document.addEventListener('DOMContentLoaded', function () {
//             var calendarEl = document.getElementById('calendar');
//             var miniCalendarEl = document.getElementById('mini-calendar');
//             var eventTitleInput = document.getElementById('event-title');
//             var eventDateInput = document.getElementById('event-date');
//             var saveEventBtn = document.getElementById('save-event');
//             var openModalBtn = document.getElementById('open-modal');
//             var addEventModal = new bootstrap.Modal(document.getElementById('addEventModal'));

//             // Initialisation du calendrier principal
//             var calendar = new FullCalendar.Calendar(calendarEl, {
//                 initialView: 'dayGridMonth',
//                 selectable: true,
//                 editable: true,
//                 droppable: true,
//                 events: JSON.parse(localStorage.getItem('events')) || [],
//                 dateClick: function (info) {
//                     eventTitleInput.value = "";
//                     eventDateInput.value = info.dateStr + "T12:00";
//                     addEventModal.show();
//                 },
//                 eventDrop: function (info) {
//                     updateLocalStorage();
//                 },
//                 eventResize: function (info) {
//                     updateLocalStorage();
//                 }
//             });

//             calendar.render();

//             // Initialisation du mini-calendrier indépendant
//             var miniCalendar = new FullCalendar.Calendar(miniCalendarEl, {
//                 initialView: 'dayGridMonth',
//                 selectable: true,
//                 headerToolbar: {
//                     left: 'prev,next', // Icônes de navigation
//                     center: 'title',
//                     right: ''
//                 },
//                 // Supprimer les événements du mini-calendrier
//                 events: [],
//                 // Sélectionner une date sur le mini-calendrier pour mettre à jour la vue du calendrier principal
//                 dateClick: function (info) {
//                     // Mettre à jour la vue du calendrier principal en fonction de la date sélectionnée
//                     calendar.gotoDate(info.date);
//                     console.log("Date sélectionnée sur le mini-calendrier: " + info.dateStr);
//                 }
//             });

//             miniCalendar.render();

//             // Mise à jour du stockage local et ajout d'événements
//             function updateLocalStorage() {
//                 var events = [];
//                 calendar.getEvents().forEach(event => {
//                     events.push({ title: event.title, start: event.start.toISOString() });
//                 });
//                 localStorage.setItem('events', JSON.stringify(events));
//             }

//             saveEventBtn.addEventListener('click', function () {
//                 if (eventTitleInput.value && eventDateInput.value) {
//                     var newEvent = {
//                         title: eventTitleInput.value,
//                         start: eventDateInput.value
//                     };
//                     calendar.addEvent(newEvent);
//                     saveEventToLocalStorage(newEvent);
//                     addEventModal.hide();
//                 }
//             });

//             function saveEventToLocalStorage(event) {
//                 var events = JSON.parse(localStorage.getItem('events')) || [];
//                 events.push(event);
//                 localStorage.setItem('events', JSON.stringify(events));
//             }
//         });
//     </script>

// </body>

// </html>