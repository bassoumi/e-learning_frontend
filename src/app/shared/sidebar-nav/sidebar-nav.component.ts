import { Component, EventEmitter, Input, Output } from '@angular/core';

interface NavItem {
  label: string;
  icon: string;       // CSS class or material ligature
  route?: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar-nav',
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.scss']
})
export class SidebarNavComponent {


  @Input() isCollapsed!: boolean;
@Output() toggle = new EventEmitter<void>();

    // Example menu structure
    items: NavItem[] = [
      { label: 'Accueil', icon: 'home', route: '/home' },
      { label: 'Tableau de bord', icon: 'dashboard', route: '/dashboard' },
      {
        label: 'Communication',
        icon: 'chat_bubble',
        children: [
          { label: 'Messagerie', icon: 'mail', route: '/comms/messages' },
          { label: 'Notifications', icon: 'notifications', route: '/comms/notifications' },
        ]
      },
      { label: 'Gestion des cas', icon: 'folder_open', route: '/cases' },
      { label: 'Accompagnement', icon: 'thumb_up', route: '/support' },
      { label: 'Formations', icon: 'video_library', children: [
          { label: 'Catalogue', icon: 'menu_book', route: '/trainings/catalog' },
          { label: 'Mes formations', icon: 'school', route: '/trainings/mine' },
        ]
      },
      { label: 'Rapports', icon: 'insert_chart', children: [
          { label: 'Statistiques', icon: 'bar_chart', route: '/reports/stats' },
          { label: 'Exports', icon: 'file_download', route: '/reports/exports' },
        ]
      },
      { label: 'Plus', icon: 'more_horiz', route: '/more' }
    ];
  
    // track which dropdown is open
    openSection: string | null = null;
  
    toggleSection(label: string) {
      this.openSection = this.openSection === label ? null : label;
    }



    toggleCollapse() {
      this.toggle.emit();  // inform parent to toggle
    }
  }
