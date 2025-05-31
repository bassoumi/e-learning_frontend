import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
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
  showSuggestions = false;
  searchTerm = '';
  searchControl = new FormControl('');
  suggestions: Course[] = [];
  isLoading = false;

  @Input() isCollapsed: boolean = false; // to receive sidebar state
  @Output() toggle = new EventEmitter<void>();

  showSettingsMenu = false;
  isDarkMode = false;
  isRTL = false;
  currentLanguage = 'FR';

  constructor(
    private router: Router,
    private courseService: CourseService,
    private el: ElementRef
  ) {}

  openAccountSettings() {
    throw new Error('Method not implemented.');
  }

  toggleLanguageMenu() {
    throw new Error('Method not implemented.');
  }

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
    this.currentLanguage = this.currentLanguage === 'FR' ? 'EN' : 'FR';
  }

  logout() {
    // Implement logout logic
  }

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
      next: (courses) => {
        this.suggestions = courses;
        this.isLoading = false;
      },
      error: () => {
        this.suggestions = [];
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    const term = this.searchControl.value?.trim() ?? '';
    if (!term) {
      return;
    }

    // Look for an exact match in the suggestions array
    const matched = this.suggestions.find(
      c => c.title.toLowerCase() === term.toLowerCase()
    );

    if (matched) {
      // Navigate to the course detail page using the matched course's ID
      this.router.navigate(['/courses', 'course-detail', matched.id]);
    } else {
      // No exact match: optionally handle this case or navigate to filtered list
      console.warn(`Aucun cours trouvé portant exactement le titre "${term}"`);
      // Example: navigate to list with query parameter
      // this.router.navigate(['/courses'], { queryParams: { title: term } });
    }

    this.suggestions = [];
    this.showSuggestions = false;
  }

  selectSuggestion(course: Course): void {
    // Navigate immediately to the course detail page
    this.router.navigate(['/courses', 'course-detail', course.id]);
    // Update the search input to reflect the selected course title
    this.searchControl.setValue(course.title);
    // Clear suggestions and close dropdown
    this.suggestions = [];
    this.showSuggestions = false;
  }

  highlightMatch(text: string, search: string): string {
    if (!search) return text;
    const regex = new RegExp(search, 'gi');
    return text.replace(regex, match => `<span class="highlight">${match}</span>`);
  }

  onSearchFocus(): void {
    this.showSuggestions = true;
  }

  closeSuggestions(): void {
    this.showSuggestions = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const container = this.el.nativeElement.querySelector('.search-container');
    if (container && !container.contains(event.target as Node)) {
      this.closeSuggestions();
    }
  }

}
