import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { NotificationDto } from 'src/app/core/models/NotificationDto';
import { StudentService } from '../../students/services/student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})

export class NotificationComponent implements OnInit {
  notifications: NotificationDto[] = [];
  isListView = true;


  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const studentId = this.authService.getLoggedInStudentId();
    if (studentId !== null) {
      this.loadNotifications(studentId);
    }
  }

  private loadNotifications(studentId: number): void {
    this.studentService.getUnreadNotifications(studentId).subscribe({
      next: (notifs) => {
        console.log('Notifications non lues récupérées pour l\'étudiant ID:', notifs);
  
        // Tri par date décroissante (du plus récent au plus ancien)
        this.notifications = notifs.sort((a, b) => {
          const dateA = new Date(a.createdAt ?? 0).getTime();
          const dateB = new Date(b.createdAt ?? 0).getTime();
          return dateB - dateA;
        });
  
        console.log('Notifications chargées:', this.notifications);
      },
      error: (err) => console.error('Erreur lors du chargement des notifications :', err)
    });
  }
  

  onClickNotification(notification: NotificationDto): void {
    const studentId = this.authService.getLoggedInStudentId();
    if (studentId == null) return;

    // Naviguer vers le détail du cours
    this.router.navigate(['/courses/course-detail', notification.courseId]);

    // Marquer la notification comme lue après navigation
    this.studentService.markNotificationAsRead(studentId, notification.id).subscribe({
      next: () => {
        // Supprimer la notification de la liste locale
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
      },
      error: err => console.error('Erreur lors du marquage comme lu :', err)
    });
  }

  goToCategory(categoryId: number): void {
    this.router.navigate(['/categories', categoryId]);
  }
  
  goToInstructors(instructorId: number): void {
    this.router.navigate(['/instructors', instructorId]);
  }
  

  get uniqueInstructors(): NotificationDto[] {
    return this.notifications.filter((item, index, array) =>
      array.findIndex(t => t.instructorId === item.instructorId) === index
    );
  }

  
}
