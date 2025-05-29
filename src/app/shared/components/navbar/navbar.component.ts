import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Course } from 'src/app/core/models/course.model';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
  of,
  catchError
} from 'rxjs';
import { CourseService } from 'src/app/features/courses/services/course.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  searchTerm = '';
  searchControl = new FormControl('');
  suggestions: Course[] = [];
  isLoading = false;

  @Input() isCollapsed: boolean = false; // to receive sidebar state
  @Output() toggle = new EventEmitter<void>();

  constructor(private router: Router ,
    private courseService: CourseService
  ) {}
  
openAccountSettings() {
throw new Error('Method not implemented.');
}
toggleLanguageMenu() {
throw new Error('Method not implemented.');
}


showSettingsMenu = false;
isDarkMode = false;
isRTL = false;
currentLanguage = 'FR';

toggleSettingsMenu() {
  this.showSettingsMenu = !this.showSettingsMenu;
}

toggleDarkMode() {
  this.isDarkMode = !this.isDarkMode;
  document.body.classList.toggle('dark-mode', this.isDarkMode);
}

toggleDirection() {
  this.isRTL = !this.isRTL;
  document.body.dir = this.isRTL ? 'rtl' : 'ltr';
}

changeLanguage() {
  // Implement language change logic
  this.currentLanguage = this.currentLanguage === 'FR' ? 'EN' : 'FR';
}

logout() {
  // Implement logout logic
}

// Close dropdown when clicking outside
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  if (!(event.target as HTMLElement).closest('.settings-dropdown')) {
    this.showSettingsMenu = false;
  }

}
 // to notify when toggled

toggleSidebar() {
  this.toggle.emit(); // emit the event to parent
}

ngOnInit(): void {
  this.searchControl.valueChanges.pipe(
    // 1) filter out nulls and short strings
    filter((term): term is string => term != null && term.length >= 2),
    // 2) wait 300ms after the last keystroke
    debounceTime(300),
    // 3) only continue if the value changed
    distinctUntilChanged(),
    // 4) show loading spinner
    tap(() => {
      this.isLoading = true;
      this.suggestions = [];
    }),
    // 5) switch to the HTTP search Observable
    switchMap(term =>
      this.courseService.getCoursesByTitle(term).pipe(
        // 6) optional: if the backend fails, recover with empty list
        catchError(() => of([]))
      )
    )
  )
  .subscribe({
    next: courses => {
      this.suggestions = courses;
      this.isLoading = false;
    },
    error: () => { // should rarely hit this because of catchError
      this.suggestions = [];
      this.isLoading = false;
    }
  });
}

onSearch(): void {
  const term = this.searchControl.value?.trim() ?? '';
  if (term) {
    this.router.navigate(
      ['/courses'],
      { queryParams: { title: term } }
    );
    this.suggestions = [];
  }
}

selectSuggestion(course: Course): void {
  // you could navigate directly to course detail…
  // this.router.navigate(['/courses', 'course-detail', course.id]);

  // or set the search and show list filtered by title:
  this.searchControl.setValue(course.title);
  this.onSearch();
}

}
