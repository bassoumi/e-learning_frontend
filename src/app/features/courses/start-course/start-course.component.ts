import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Content, Course } from 'src/app/core/models/course.model';
import { CourseService } from '../services/course.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StudentService } from '../../students/services/student.service';
import { ProgressionService } from '../../progression/services/progression.service';
import { switchMap, catchError, of, Observable, forkJoin, tap, throwError } from 'rxjs';
import { ProgressionResponse, ProgressionRequest } from 'src/app/core/models/progression.model';
import { Student } from 'src/app/core/models/student.model';
import { InstructorService } from '../../instructors/services/instructor.service';
import { CommentResponse, CommentRequest, LikeRequest, LikeResponse } from 'src/app/core/models/feedback.model';
import { ContentService } from '../../contents/services/content.service';
import { jsPDF } from 'jspdf';
import { VideoSummary } from 'src/app/core/models/videoSummary.model';

@Component({
  selector: 'app-start-course',
  templateUrl: './start-course.component.html',
  styleUrls: ['./start-course.component.scss']
})

export class StartCourseComponent implements OnInit {
  // ================= Propriétés de progression =================
  completedVideos = new Set<number>();
  course?: Course;
  currentVideo?: Content;
  progressions: ProgressionResponse[] = [];
  isLiked = false; 
  summary: string = '';
  title: string = '';
  videoSummary!: VideoSummary;
  showChat: boolean = false;
  newMessage: string = '';

  // IDs
  studentId!: number;
  courseId!: number;
  instructorIdOfCourse?: number;
  summaryExists = false;

  // Abonnement à l'instructeur
  isSubscribed = false;
  subscriptionChecked = false;
  subscriberCount: number | null = null;

  // ================= Propriétés pour feedback =================
  comments: CommentResponse[] = [];
  newCommentText: string = '';
  likeCount: number = 0;
  commentCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private courseService: CourseService,
    private studentService: StudentService,
    private progressionService: ProgressionService,
    private instructorsService: InstructorService,
    private contentService: ContentService
  ) {}

  ngOnInit(): void {
    // 1. Récupération du courseId et studentId depuis l'URL
    const courseIdParam = this.route.snapshot.paramMap.get('courseId');
    const studentIdParam = this.route.snapshot.paramMap.get('studentId');

    const courseId = Number(courseIdParam);
    const studentId = Number(studentIdParam);

    if (!courseId || !studentId) {
      console.error('ID de cours ou d’étudiant invalide');
      return;
    }

    this.courseId = courseId;
    this.studentId = studentId;

    // 2. Charger l'étudiant, puis enchaîner sur le chargement du cours + progressions
    this.studentService.getStudentById(this.studentId).pipe(
      switchMap(stu => {
        // 2.a) on a l'étudiant → studentId déjà assigné
        // 2.b) on charge le cours + progressions
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

        // 4. Vérifier la souscription de l'étudiant
        this.checkSubscription();

        // 5. Récupérer le nombre d'abonnés de l'instructeur
        this.instructorsService.getSubscriberCount(this.instructorIdOfCourse!).subscribe({
          next: count => this.subscriberCount = count,
          error: err => {
            console.error('Erreur en récupérant le nombre d\'abonnés', err);
            this.subscriberCount = 0;
          }
        });
      }

      // 6. Initialiser les feedbacks pour la vidéo courante
      if (this.currentVideo) {
        this.loadCommentsAndCounts(this.currentVideo.id);
        this.courseService.getSummary(this.currentVideo.id)
        .pipe(
          tap(summary => {
            // si on a un résumé, on l'affiche et on active le bouton "Télécharger"
            this.videoSummary = summary;
            this.summaryExists = true;
            console.log('Résumé vidéo récupéré :', summary);
          }),
          catchError(err => {
            if (err.status === 403) {
              // pas encore de résumé -> bouton "Générer"
              this.summaryExists = false;
              console.warn('Résumé vidéo non trouvé, il faut le générer');
              return of(null);
            }
            // autre erreur
            console.error('Erreur vérif. résumé', err);
            return throwError(() => err);
          })
        )
        .subscribe();
    
      }
    });
  }


  

  // ==================== Méthodes de progression ====================

  private loadCourseAndProgressions(studentId: number, courseId: number): Observable<any> {
    return this.courseService.getCourseById(courseId).pipe(
      switchMap(course => {
        this.course = Array.isArray(course) ? course[0] : course;
        if (this.course && this.course.contents) {
          this.course.contents.sort((a, b) => a.orderContent - b.orderContent);
        }

        // 1) Récupérer toutes les progressions de l'étudiant
        return this.progressionService.listByStudent(studentId);
      }),
      switchMap(allProgs => {
        // 2) Filtrer celles qui concernent ce cours
        const contents = this.course?.contents ?? [];
        this.progressions = allProgs.filter(p =>
          contents.some(c => c.id === p.contentId)
        );

        if (this.progressions.length) {
          this.syncUIWithProgressions();
          return of(null);
        }

        // 3) Pas de progression existante : initialiser pour chaque contenu
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

    // Déterminer la prochaine vidéo à jouer
    let next = contents[0];
    for (const c of contents) {
      const prog = this.progressions.find(p => p.contentId === c.id);
      if (prog && prog.status !== 'COMPLETED') {
        next = c;
        break;
      }
    }
    this.currentVideo = next;

    // Charger les feedbacks pour cette vidéo
    if (this.currentVideo) {
      this.loadCommentsAndCounts(this.currentVideo.id);
    }
  }

  setCurrentVideo(video: Content): void {
    this.currentVideo = video;
    this.completedVideos.add(video.id);

    // Calcul du pourcentage de progression
    const totalVideos = this.course?.contents?.length ?? 1;
    const perVideoPct = Math.floor(100 / totalVideos);
    const isFinished = this.completedVideos.has(video.id);
    const newPct = isFinished ? perVideoPct : 0;
    const newStatus = this.isLastVideo() ? 'COMPLETED' : 'IN_PROGRESS';

    const payload: ProgressionRequest = {
      progressionPercentage: newPct,
      lastAccessed: new Date().toISOString(),
      status: newStatus
    };

    const existing = this.progressions.find(p => p.contentId === video.id);
    if (existing) {
      this.progressionService.updateProgression(this.studentId, video.id, payload).subscribe({
        next: upd => {
          Object.assign(existing, upd);
          console.log('Progression mise à jour :', upd);
        },
        error: err => console.error('Erreur update:', err)
      });
    } else {
      this.progressionService.createProgression(this.studentId, video.id, payload).subscribe({
        next: created => {
          this.progressions.push(created);
          console.log('Progression créée :', created);
        },
        error: err => console.error('Erreur create:', err)
      });
    }

    // Recharger les feedbacks après changement de vidéo
    this.loadCommentsAndCounts(video.id);


    this.courseService.getSummary(video.id)
    .pipe(
      tap((response: VideoSummary) => {
        // keep the full object if you need it elsewhere
        this.videoSummary  = response;
        this.summaryExists = true;
  
        // extract the actual string
        const text = response.summaryText;
  
        console.log('Résumé vidéo récupéré :', text);
  
        this.messages.push({
          text:   text,    // now a string
          sender: 'bot',
          time:   new Date(),
        });
        this.messages.push({
          text: '📥 Would you like to generate a PDF résumé?',
          sender: 'bot',
          time: new Date(),
          isPdfButton: true // 👈 Add this flag for conditional rendering
        });
      }),
      catchError(err => {
        if (err.status === 403) {
          this.summaryExists = false;
          console.log('Résumé vidéo non trouvé, il faut le générer');
  
          this.messages.push({
            text:   'Aucun résumé trouvé. Cliquez sur « Generate an AI résumé » pour en créer un.',
            sender: 'bot',
            time:   new Date(),
          });
          return of(null);
        }
  
        console.error('Erreur vérif. résumé', err);
        this.messages.push({
          text:   'Désolé, impossible de vérifier le résumé pour le moment.',
          sender: 'bot',
          time:   new Date(),
        });
        return throwError(() => err);
      })
    )
    .subscribe();
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

  isCompleted(content: Content): boolean {
    if (this.completedVideos.has(content.id)) {
      return true;
    }

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

  // ================= Méthodes de souscription =================

  private checkSubscription(): void {
    if (this.instructorIdOfCourse === undefined || this.instructorIdOfCourse === null) {
      this.isSubscribed = false;
      this.subscriptionChecked = true;
      return;
    }

    this.studentService.getSubscription(this.studentId).subscribe({
      next: (resp: any) => {
        console.log('Réponse getSubscription reçue (brute) :', resp);
        this.isSubscribed = Array.isArray(resp.instructorIds)
          ? resp.instructorIds.includes(this.instructorIdOfCourse!)
          : false;
        this.subscriptionChecked = true;
      },
      error: err => {
        console.error('Erreur lors de la vérification d’abonnement :', err);
        this.isSubscribed = false;
        this.subscriptionChecked = true;
      }
    });
  }

  subscribe(): void {
    if (!this.instructorIdOfCourse) {
      return;
    }

    this.studentService.subscribeToInstructor(this.studentId, this.instructorIdOfCourse).subscribe({
      next: updatedStudent => {
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
      console.error('Impossible de se désabonner : instructorIdOfCourse est indéfini');
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

  // ================= NOUVELLES MÉTHODES DE FEEDBACK =================

  /**
   * Charge les commentaires et compte, ainsi que le nombre de likes pour un contentId donné.
   */
  loadCommentsAndCounts(contentId: number): void {
    // 1) Récupérer la liste des commentaires
    this.contentService.getComments(contentId).subscribe({
      next: (comments) => {
        this.comments = comments;
        console.log('Commentaires récupérés :', comments);
      },
      error: (err) => {
        console.error('Erreur en récupérant les commentaires :', err);
        this.comments = [];
      }
    });

    // 2) Récupérer le nombre total de commentaires
    this.contentService.countComments(contentId).subscribe({
      next: (count) => this.commentCount = count,
      error: (err) => {
        console.error('Erreur en comptant les commentaires :', err);
        this.commentCount = 0;
      }
    });

    // 3) Récupérer le nombre de likes
    this.contentService.countLikes(contentId).subscribe({
      next: (count) => this.likeCount = count,
      error: (err) => {
        console.error('Erreur en comptant les likes :', err);
        this.likeCount = 0;
      }
    });
  }

  /**
   * Ajoute un nouveau commentaire sur la vidéo courante.
   */
  addComment(): void {
    if (!this.currentVideo) {
      return;
    }
    const request: CommentRequest = {
      contentId: this.currentVideo.id,
      userId: this.studentId,
      texte: this.newCommentText.trim()
    };
    if (!request.texte) {
      return; // ne rien faire si le texte est vide
    }
    console.log('Commentaire ajouté :', request);

    this.contentService.addComment(request).subscribe({
      next: (response: CommentResponse) => {
        this.comments.push(response);
        this.commentCount += 1;
        this.newCommentText = '';
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du commentaire :', err);
      }
    });
  }

  /**
   * Ajoute un like pour la vidéo courante.
   */toggleLike(): void {
    if (!this.currentVideo) {
      return;
    }

    const request: LikeRequest = {
      contentId: this.currentVideo.id,
      userId: this.studentId
    };

    if (this.isLiked) {
      // on annule le like
      this.contentService.removeLike(request).subscribe({
        next: () => {
          this.isLiked = false;
          this.likeCount = Math.max(0, this.likeCount - 1);
        },
        error: err => {
          console.error('Erreur lors de la suppression du like :', err);
        }
      });
    } else {
      // on ajoute le like
      this.contentService.addLike(request).subscribe({
        next: () => {
          this.isLiked = true;
          this.likeCount++;
        },
        error: err => {
          console.error('Erreur lors de l’ajout du like :', err);
        }
      });
    }
  }
  isTyping = false;

  currentvd(currentVideo: Content) {
    // (Optional) show a “typing…” or confirmation from the user

    this.isTyping = true;
    this.courseService.summarizeContent(currentVideo.id).subscribe({
      next: vs => {
        // vs.summaryText is the résumé text
        this.messages.push({
          text: vs.summaryText,
          sender: 'bot',
          time: new Date(),
        });
      },
      error: err => {
        console.error('Erreur lors du résumé', err);
        this.messages.push({
          text: "Sorry, I couldn’t generate the résumé 😔. Please try again later 🔄",
          sender: 'bot',
          time: new Date(),
        });
      }
    });
  }
  

  downloadPdf() {
    if (!this.summary) { return; }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(this.title, 10, 20);
    doc.setFontSize(12);
    const split = doc.splitTextToSize(this.summary, 180);
    doc.text(split, 10, 30);
    doc.save(`${this.title}.pdf`);
  }















  // Component properties

messages: any[] = [
  {
    text: "Hello! I’m your assistant 🤖. How can I help you today? 🚀",
    sender: 'bot',
    time: new Date()
  }
];

// Toggle chat visibility
toggleChat() {
  this.showChat = !this.showChat;
}

// Send new message
sendMessage() {
  if (this.newMessage.trim() === '') return;
  
  // Add user message
  this.messages.push({
    text: this.newMessage,
    sender: 'user',
    time: new Date()
  });
  
  // Simulate bot response after delay
  setTimeout(() => {
    this.messages.push({
      text: "I’m a virtual assistant. This feature is under development 🔧",
      sender: 'bot',
      time: new Date()
    });
  }, 1000);
  
  this.newMessage = '';
}

suggestionUsed = false;  


onGenerateResumeClick() {
  const userText = '✏️ Generate a résumé for this content';
  this.messages.push({
    text:   userText,
    sender: 'user',
    time:   new Date(),
  });

  this.suggestionUsed = true;

  this.isTyping = true;
  this.currentvd(this.currentVideo!);
}
}

