import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Content, Course } from 'src/app/core/models/course.model';
import { CourseService } from '../services/course.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StudentService } from '../../students/services/student.service';
import { ProgressionService } from '../../progression/services/progression.service';
import { switchMap, catchError, of, Observable, forkJoin } from 'rxjs';
import { ProgressionResponse, ProgressionRequest } from 'src/app/core/models/progression.model';
import { Student } from 'src/app/core/models/student.model';
import { InstructorService } from '../../instructors/services/instructor.service';

@Component({
  selector: 'app-start-course',
  templateUrl: './start-course.component.html',
  styleUrls: ['./start-course.component.scss']
})
export class StartCourseComponent implements OnInit {
  completedVideos = new Set<number>();
  course?: Course;
  currentVideo?: Content;
  progressions: ProgressionResponse[] = [];
  studentId!: number;

  instructorIdOfCourse?: number;    
  isSubscribed = false;          
  subscriptionChecked = false;
  courseId!: number;
  subscriberCount: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private courseService: CourseService,
    private studentService: StudentService,
    private progressionService: ProgressionService,
    private instructorsService: InstructorService // Assuming this is the service to get instructor details
  ) {}

  ngOnInit(): void {
    // 1. On récupère courseId et studentId depuis l'URL
    const courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    const studentId = Number(this.route.snapshot.paramMap.get('studentId'));
    if (!courseId || !studentId) {
      console.error('ID de cours ou d’étudiant invalide');
      return;
    }

    this.courseId = courseId;
    this.studentId = studentId;

    // 2. Charger l'étudiant, puis enchaîner sur le chargement du cours + progressions
    this.studentService.getStudentById(this.studentId).pipe(
      switchMap(stu => {
        // 2.a) on a l'étudiant → on garde studentId en local (déjà assigné plus haut)
        // 2.b) on charge le cours + progressions (méthode que vous implémentez ailleurs)
        return this.loadCourseAndProgressions(stu.id, this.courseId);
      }),
      catchError(err => {
        console.error('Erreur init:', err);
        return of(null);
      })
    ).subscribe(() => {
      // 3. Quand course + progressions sont chargés, this.course est renseigné
      if (this.course) {
        this.instructorIdOfCourse = this.course.instructorId;

        // 4. Vérifier la souscription de l'étudiant (votre méthode existante)
        this.checkSubscription();

        // 5. Appeler getSubscriberCount pour l'instructeur récupéré
        this.instructorsService
          .getSubscriberCount(this.instructorIdOfCourse)
          .subscribe({
            next: (count) => this.subscriberCount = count,
            error: (err) => {
              console.error('Erreur en récupérant le nombre d\'abonnés', err);
              this.subscriberCount = 0;
            }
          });
      }
    });
  }

  private checkSubscription(): void {
    // Vérifie si instructorIdOfCourse est défini et différent de 0 (si 0 n'est pas valide)
    if (this.instructorIdOfCourse === undefined || this.instructorIdOfCourse === null) {
      this.isSubscribed = false;
      this.subscriptionChecked = true;
      return;
    }
  
// 1) Log avant l'appel au service
this.studentService.getSubscription(this.studentId).subscribe({
  next: (resp: any) => {
    // Affichez « brute » le JSON renvoyé par le backend
    console.log('Réponse getSubscription reçue (brute) :', resp);

    // Si votre backend renvoie { instructorIds: [...] }, on peut vérifier :
    this.isSubscribed = Array.isArray(resp.instructorIds)
      ? resp.instructorIds.includes(this.instructorIdOfCourse)
      : false;

    this.subscriptionChecked = true;
  },
  error: (err) => {
    console.error('Erreur lors de la vérification d’abonnement :', err);
    this.isSubscribed = false;
    this.subscriptionChecked = true;
  }
});

  }
  


  subscribe(): void {
    if (!this.instructorIdOfCourse) {
      return; // pas d’instructeur à abonner
    }

    this.studentService.subscribeToInstructor(this.studentId, this.instructorIdOfCourse).subscribe({
      next: updatedStudent => {
        // L’abonnement a réussi : on met à jour le drapeau
        this.isSubscribed = true;
        console.log('Abonnement réussi :', updatedStudent);
      },
      error: err => {
        console.error('Erreur lors de l’abonnement :', err);
      }
    });
  }

  unsubscribe(): void {
    if (this.instructorIdOfCourse === undefined) {
      console.error("Impossible de se désabonner : instructorIdOfCourse est indéfini");
      return;
    }
  
    this.studentService.unsubscribe(this.studentId, this.instructorIdOfCourse).subscribe({
      next: () => {
        this.isSubscribed = false;
      },
      error: err => {
        console.error('Erreur lors du désabonnement :', err);
      }
    });
  }
  
  


  private loadCourseAndProgressions(studentId: number, courseId: number): Observable<any> {
    return this.courseService.getCourseById(courseId).pipe(
      switchMap(course => {
        this.course = Array.isArray(course) ? course[0] : course;
        if (this.course && this.course.contents) {
          this.course.contents.sort((a, b) => a.orderContent - b.orderContent);
        }

        // 1) fetch all progressions for this student
        return this.progressionService.listByStudent(studentId);
      }),
      switchMap(allProgs => {
        // 2) filter only those for this course
        const contents = this.course?.contents ?? [];
        this.progressions = allProgs.filter(p =>
          contents.some(c => c.id === p.contentId)
        );

        if (this.progressions.length) {
          this.syncUIWithProgressions();
          return of(null);
        }

        // 3) no existing: create an entry for each content
        const initRequests = (this.course?.contents ?? []).map(content => {
          const payload: ProgressionRequest = {
            progressionPercentage: 0,
            lastAccessed: new Date().toISOString(),
            status: 'NOT_STARTED'
          };
          return this.progressionService.createProgression(
            studentId,
            content.id,
            payload
          ).pipe(catchError(err => {
            console.error('Erreur création initiale:', err);
            return of(null);
          }));
        });

        return forkJoin(initRequests);
      }),
      switchMap(createdArray => {
        // if we did create, replace progressions and sync UI
        if (Array.isArray(createdArray)) {
          this.progressions = createdArray.filter((p): p is ProgressionResponse => p != null);
          this.syncUIWithProgressions();
        }
        return of(null);
      }),
      catchError(err => {
        console.error('Erreur loadCourseAndProgressions:', err);
        return of(null);
      })
    );
  }

  private syncUIWithProgressions(): void {
    const contents = this.course?.contents ?? [];
    contents.sort((a, b) => a.orderContent - b.orderContent);

    this.completedVideos.clear();
    this.progressions.forEach(p => {
      if (p.status === 'COMPLETED') {
        this.completedVideos.add(p.contentId);
      }
    });

    // pick next video
    let next = contents[0];
    for (const c of contents) {
      const prog = this.progressions.find(p => p.contentId === c.id);
      if (prog && prog.status !== 'COMPLETED') {
        next = c;
        break;
      }
    }
    this.currentVideo = next;
  }

  setCurrentVideo(video: Content): void {
    this.currentVideo = video;
    this.completedVideos.add(video.id);
  
    // 1) Nombre total de vidéos dans le cours
    const totalVideos = this.course?.contents?.length ?? 1;
    // 2) Pourcentage qu'une seule vidéo représente (arrondi vers le bas)
    const perVideoPct = Math.floor(100 / totalVideos);
  
    // 3) Calcul du nouveau pourcentage pour cette vidéo
    //    → Si la vidéo est dans completedVideos, alors c'est "terminé"
    //    → Sinon, on peut envoyer 0 (ou un pourcentage interne si besoin)
    const isFinished = this.completedVideos.has(video.id);
    const newPct = isFinished ? perVideoPct : 0;
  
    // 4) Statut de la progression : si c'est la dernière vidéo, on marque COMPLETED
    const newStatus = this.isLastVideo() ? 'COMPLETED' : 'IN_PROGRESS';
  
    const payload: ProgressionRequest = {
      progressionPercentage: newPct,
      lastAccessed: new Date().toISOString(),
      status: newStatus
    };
  
    // 5) Appel au backend, update ou create selon si la progression existe déjà
    const existing = this.progressions.find(p => p.contentId === video.id);
    if (existing) {
      this.progressionService
        .updateProgression(this.studentId, video.id, payload)
        .subscribe({
          next: upd => {
            Object.assign(existing, upd);
            console.log('Progression mise à jour :', upd);
          },
          error: err => console.error('Erreur update:', err)
        });
    } else {
      this.progressionService
        .createProgression(this.studentId, video.id, payload)
        .subscribe({
          next: created => {
            this.progressions.push(created);
            console.log('Progression créée :', created);
          },
          error: err => console.error('Erreur create:', err)
        });
    }
  }
  

  getSafeUrl(url: string): SafeResourceUrl {
    const reg = /^.*(?:youtu\.be\/|v\/|embed\/|watch\?v=)([^#&?]*).*/;
    const m = url.match(reg);
    const id = m && m[1].length === 11 ? m[1] : null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      id ? `https://www.youtube.com/embed/${id}` : url
    );
  }

  getThumbnail(url: string): string {
    const reg = /^.*(?:youtu\.be\/|v\/|embed\/|watch\?v=)([^#&?]*).*/;
    const m = url.match(reg);
    return m && m[1].length === 11
      ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg`
      : 'https://via.placeholder.com/120x70?text=No+Thumbnail';
  }

// Après, on se base d’abord sur le Set 'completedVideos' :
isCompleted(content: Content): boolean {
  // Si on a déjà cliqué sur la vidéo, ona l’a ajouté dans completedVideos.
  if (this.completedVideos.has(content.id)) {
    return true;
  }
  // Sinon, on retombe sur le check existant des progressions “effectivement persistées”
  const prog = this.progressions.find(p => p.contentId === content.id);
  return !!prog && prog.progressionPercentage > 0;
}


  isLastVideo(): boolean {
    const c = this.course?.contents;
    return !!(c && this.currentVideo && c[c.length - 1].id === this.currentVideo.id);
  }

  navigateToQuiz(): void {
    if (this.course?.id != null) {
      this.router.navigate(['courses', this.course.id, 'quiz']);
    }
  }









}
