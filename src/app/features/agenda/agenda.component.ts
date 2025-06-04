import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AgendaEntry } from 'src/app/core/models/agenda-entry.model';
import { PersonalEvent, PersonalEventRequest } from 'src/app/core/models/personal-event.model';
import { AgendaService } from './service/agenda.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {
  personalEventForm: FormGroup;
  personalEvents: PersonalEvent[] = [];
  agendaEntries: AgendaEntry[] = [];
  showAddEventModal = false;
  selectedEvent: any = null;

  // Variables pour l'agenda
  /** On couvre 24h en 8 créneaux de 3 heures chacun, mais on commence l'affichage à 9h. */
  protected slotStep = 3;
  private slotsCount = 8;
  private startHour = 9;

  hours: number[] = [];   // par ex. [9, 12, 15, 18, 21, 0, 3, 6]
  days: any[] = [];
  allEvents: any[] = [];
  currentDate = new Date();
  private _currentWeekDates = '';

  constructor(
    private fb: FormBuilder,
    private agendaService: AgendaService,
    private authService: AuthService,
    private router: Router
  ) {
    this.personalEventForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      eventDateTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const studentId = this.authService.getLoggedInStudentId();
    if (studentId != null) {
      this.loadPersonalEvents(studentId);
      this.loadAgendaEntries(studentId);
    }

    this.generateHours();
    this.generateWeekDays();
  }

  private loadPersonalEvents(studentId: number): void {
    this.agendaService.listPersonalEvents(studentId).subscribe({
      next: events => {
        this.personalEvents = events;
        console.log('Événements personnels chargés :', this.personalEvents);
        this.transformEvents();
      },
      error: err => console.error('Erreur en chargeant les événements personnels :', err)
    });
  }

  private loadAgendaEntries(studentId: number): void {
    this.agendaService.listAgendaEntries(studentId).subscribe({
      next: entries => {
        this.agendaEntries = entries;
        console.log('Entrées d\'agenda chargées :', this.agendaEntries);
        this.transformEvents();
      },
      error: err => console.error('Erreur en chargeant les entrées d\'agenda :', err)
    });
  }

  // Transforme les données en format utilisable par l'agenda
  transformEvents(): void {
    // 1) Événements personnels
    const personalEventsFormatted = this.personalEvents.map(event => {
      const date = new Date(event.eventDateTime);
      return {
        id: event.id,
        title: event.title,
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        hour: date.getHours(),
        type: 'personal',
        description: event.description,
        fullDate: date,
        color: '#4caf50' // vert pour personnel
      };
    });

    // 2) Entrées d'agenda (cours), avec courseId et eventType = 'UPDATE' ou 'START'
    const agendaEntriesFormatted = this.agendaEntries.map(entry => {
      const dateHeure = new Date(entry.startedAt);
      const color = entry.eventType === 'UPDATE' ? 'orange' : 'blue'; 
      
      return {
        id: entry.id,
        title: `Cours ${entry.eventType}: ${entry.courseId}`,
        date: dateHeure.getDate(),
        month: dateHeure.getMonth(),
        year: dateHeure.getFullYear(),
        hour: dateHeure.getHours(),
        type: entry.eventType,
        description: `Type: ${entry.eventType}`,
        fullDate: dateHeure,
        color,
        courseId: entry.courseId,
        instructor: entry.instructorName,
        courseTitle: entry.courseTitle ,
        coursImage: entry.coursImage
      };
    });
    this.allEvents = [...personalEventsFormatted, ...agendaEntriesFormatted];
  }

  // Génère les 8 créneaux de 3h en partant de 9h
  generateHours(): void {
    this.hours = [];
    for (let i = 0; i < this.slotsCount; i++) {
      const h = (this.startHour + i * this.slotStep) % 24;
      this.hours.push(h);
    }
  }

  generateWeekDays(): void {
    const today = new Date();
    const currentDay = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

    this.days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      this.days.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        fullDate: date
      });
    }

    this.currentWeekDates = this.getCurrentWeekRange();
  }

  /**
   * Filtre les événements dont l'heure tombe dans le créneau [hour, hour + slotStep).
   */
  getEvents(day: any, hour: number): any[] {
    return this.allEvents.filter(event =>
      event.date === day.date &&
      event.month === day.month &&
      event.year === day.year &&
      event.hour >= hour &&
      event.hour < (hour + this.slotStep)
    );
  }

  getCurrentWeekRange(): string {
    const firstDay = this.days[0].fullDate;
    const lastDay = this.days[6].fullDate;
    return `${firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ` +
           `${lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }

  previousWeek(): void {
    this.days.forEach(day => {
      day.fullDate.setDate(day.fullDate.getDate() - 7);
      day.date = day.fullDate.getDate();
      day.month = day.fullDate.getMonth();
      day.year = day.fullDate.getFullYear();
    });
    this.currentWeekDates = this.getCurrentWeekRange();
  }

  nextWeek(): void {
    this.days.forEach(day => {
      day.fullDate.setDate(day.fullDate.getDate() + 7);
      day.date = day.fullDate.getDate();
      day.month = day.fullDate.getMonth();
      day.year = day.fullDate.getFullYear();
    });
    this.currentWeekDates = this.getCurrentWeekRange();
  }

  scrollToToday(): void {
    this.generateWeekDays();
  }

  // Création d'un événement personnel pré-rempli dans le créneau
  createEvent(day: any, hour: number): void {
    const date = new Date(day.fullDate);
    date.setHours(hour, 0, 0, 0);
    this.personalEventForm.patchValue({
      eventDateTime: this.formatDateTimeForInput(date)
    });
    this.showAddEventModal = true;
  }

  formatDateTimeForInput(date: Date): string {
    return date.toISOString().slice(0, 16);
  }

  submitEvent(): void {
    if (this.personalEventForm.invalid) {
      return;
    }
    const studentId = this.authService.getLoggedInStudentId();
    if (!studentId) {
      console.error('Student ID introuvable');
      return;
    }
    const payload: PersonalEventRequest = {
      title: this.personalEventForm.value.title,
      description: this.personalEventForm.value.description,
      eventDateTime: this.personalEventForm.value.eventDateTime
    };
    this.agendaService.addEvent(studentId, payload).subscribe({
      next: created => {
        this.personalEvents.push(created);
        this.transformEvents();
        this.personalEventForm.reset();
        this.showAddEventModal = false;
      },
      error: err => console.error('Erreur lors de la création de l\'événement :', err)
    });
  }

  deleteEvent(eventId: number, eventType: string): void {
    const studentId = this.authService.getLoggedInStudentId();
    if (!studentId) {
      console.error('Student ID introuvable');
      return;
    }
    if (eventType === 'personal') {
      this.agendaService.deletePersonalEvent(studentId, eventId).subscribe({
        next: () => {
          this.personalEvents = this.personalEvents.filter(evt => evt.id !== eventId);
          this.transformEvents();
        },
        error: err => console.error('Erreur lors de la suppression de l\'événement :', err)
      });
    } else if (eventType === 'UPDATE' || eventType === 'START') {
      this.agendaService.deleteAgendaEntry(studentId, eventId).subscribe({
        next: () => {
          this.agendaEntries = this.agendaEntries.filter(e => e.id !== eventId);
          this.transformEvents();
        },
        error: err => console.error('Erreur lors de la suppression de l\'entrée d\'agenda :', err)
      });
    }
  }

  // Getter/Setter pour currentWeekDates
  get currentWeekDates(): string {
    return this._currentWeekDates;
  }
  set currentWeekDates(value: string) {
    this._currentWeekDates = value;
  }
  showEventDetails(event: any): void {
    this.selectedEvent = event;
  }

  joinCourse(courseId: number): void {
    const studentId = this.authService.getLoggedInStudentId();
    this.router.navigate(['/courses/course-play', courseId, studentId]);
  }
}
