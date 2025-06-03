import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Category } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/features/categories/services/category.service';
import { StudentService } from 'src/app/features/students/services/student.service';



@Component({
  selector: 'app-sidebar-nav',
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.scss']
})
export class SidebarNavComponent implements OnInit {
  showInstructorMenu = false;
  showCourseMenu = false;
  showStudentMenu = false;
  showProfileMenu = false;

  @Input() isCollapsed!: boolean;
  @Output() toggle = new EventEmitter<void>();
  categoryList: Category[] = [];
  unreadCount: number = 0;


  constructor(private categoryService:CategoryService ,
    private router: Router,
    private studentService: StudentService,
    private authService: AuthService
  ) { }


  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categoryList = categories;
      },
      error: (err) => {
        console.error('Erreur de chargement des catégories', err);
      }
    });

    const studentId = this.authService.getLoggedInStudentId();
    if (studentId != null) {
      this.loadUnreadCount(studentId);
    }
    const role = this.authService.getUserRole(); // 'ADMIN', 'INSTRUCTOR' ou 'STUDENT'

    if (role === 'ADMIN') {
      this.showInstructorMenu = true;
      this.showProfileMenu = false;
    }
    if (role === 'INSTRUCTOR') {
      this.showCourseMenu = true;
      this.showProfileMenu = true; // Par exemple, si un instructor gère aussi des menus "instructor"
      // ou bien showCourseMenu = true si vous aviez un flag dédié pour les cours
    }
    if (role === 'STUDENT') {
      this.showStudentMenu = true;
      this.showProfileMenu = true;
    }

  }

  logout(): void {
    // Supprimer le token ou session
    localStorage.removeItem('token'); // ou sessionStorage.clear()
    // Rediriger vers la page de login
    this.router.navigate(['/login']);
  }
  
    openSection: string | null = null;
  
    toggleSection(label: string) {
      this.openSection = this.openSection === label ? null : label;
    }



    toggleCollapse() {
      this.toggle.emit();  // inform parent to toggle
    }





    toggleSubmenu(event: MouseEvent, item: HTMLElement): void {
      event.preventDefault();
      item.classList.toggle('open');
    }
    


    
  private loadUnreadCount(studentId: number): void {
    this.studentService.getUnreadNotifications(studentId).subscribe({
      next: notifications => {
        this.unreadCount = notifications.length;
        console.log('Nombre de notifications non lues:', this.unreadCount);
      },
      error: err => console.error(err)
    });
  }

  }
