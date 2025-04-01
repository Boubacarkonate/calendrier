var calendarSrc = {
    id: 'default',
    url: '/uxmonespace/recupererevts',
    method: 'POST',
    startParam: 'datedebut',
    endParam: 'datefin'
}
var todoSrc = {
    id: 'todo',
    url: '/uxmonespace/recupererevtstodo',
    method: 'POST',
    startParam: 'datedebut',
    endParam: 'datefin'
}
var calendar = null
var sources = [calendarSrc,todoSrc]


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
        // eventSources: sources,
        allDayText: '', // suppression "all-day"
        firstDay: 1,  //commencer l'affichage de la semaine à partir de lundi
        showNonCurrentDates: false,
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
        expandRows: true,         // Étire les cellules pour éviter les espaces vides
        aspectRatio: 1.35,
        eventLimit: 3, // Limite le nombre d'événements par jour
        eventLimitText: 'plus', // Texte pour les événements supplémentaires
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
            dateClick: function (info) {
                smallCalendar.gotoDate(info.dateStr);
                
                openEventForm(info.date, function (eventData) {
                    addEventToCalendar(calendar, eventData);
                });
            },

        eventDidMount: function (info) {
            addToFiltersList(info.event)
            checkEventFilter(info.event)
            checkEventSrcFilter(info.event)
        },
        dateClick: function (info) {
            document.getElementById('ajout_evenementdate').value = dateToSqlString(info.date)
            accordion_open_close($(document.getElementById('calmeajout').parentElement.firstElementChild))
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
            info.jsEvent.preventDefault()

            //info.event    => l'objet évènement du calendrier
            //info.el       => l'élément html
            //info.jsEvent  => l'event js déclencheur
            //info.view     => la vue calendrier actuelle
            const cell         = document.querySelector('.cell')
            function modifchamps(dis , disp_style){
                cell.querySelector(`input[name='calmemodif[titre]']`).disabled   = dis;
                cell.querySelector(`input[name='calmemodif[date]']`).disabled    = dis;
                cell.querySelector(`input[name='calmemodif[deb]']`).disabled     = dis;
                cell.querySelector(`input[name='calmemodif[fin]']`).disabled     = dis;
                cell.querySelector(`input[name='calmemodif[couleur]']`).disabled = dis;
                cell.querySelector(`button[title='Enregistrer']`).disabled       = dis;
                cell.querySelector(`span.calmemodifbt`).style.display            = disp_style;
            }
            modifchamps(true , 'none');
            switch (info.event.source.id) {
                case 'default':
                    const data = await getEvent(info.event.id)
                    if (data !== false) {
                        loadZfcaldavevent(cell, data)
                        cell.querySelector(`.champlabel`).innerHTML = `<a href="/uxtdbk?K=${data.K}" target="_blank">${data.ident}</a>`
                        cell.querySelector(`input[name='calmemodif[id]']`).value = data.id
                        cell.querySelector(`a#calmemodiflink`).href = data.link
                        modifchamps(false , 'flex');
                    }
                    break;
                case 'todo':
                    const dataTodo = await getEventTodo(info.event.id, info.event.extendedProps.K)
                    if (dataTodo !== false) {
                        loadZfcaldavevent(cell, dataTodo)
                        if(Number.isInteger(dataTodo.K))
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
            accordion_open_close($(document.querySelectorAll('.cell li.cal-menu-child:first-child a')[0]))
        }
    })
    calendar.render()
}

if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", loadCalendar)
else loadCalendar()
