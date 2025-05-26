import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  @Input() isCollapsed: boolean = false; // to receive sidebar state
  @Output() toggle = new EventEmitter<void>();
  
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
}
