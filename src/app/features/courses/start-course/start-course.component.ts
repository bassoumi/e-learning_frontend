import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Content, Course } from 'src/app/core/models/course.model';
import { CourseService } from '../services/course.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-start-course',
  templateUrl: './start-course.component.html',
  styleUrls: ['./start-course.component.scss']
})
export class StartCourseComponent implements OnInit {

  completedVideos: Set<number> = new Set();
  course?: Course;
  currentVideo?: Content;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private courseService: CourseService
  ) {}
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      console.error('Invalid course ID');
      return;
    }

    this.courseService.getCourseById(id).subscribe({
      next: data => {
        this.course = Array.isArray(data) ? data[0] : data;

        // Narrow `contents` so TS knows it's not undefined
        const contents = this.course?.contents;
        if (contents && contents.length > 0) {
          contents.sort((a, b) => a.orderContent - b.orderContent);
          this.currentVideo = contents[0];
          this.completedVideos.add(this.currentVideo.id);
        }
      },
      error: err => console.error('Error loading course:', err)
    });
  }

  setCurrentVideo(video: Content): void {
    this.currentVideo = video;
    this.completedVideos.add(video.id);
  }

  getSafeUrl(url: string): SafeResourceUrl {
    // Build a YouTube embed URL
    const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const vid = match && match[1].length === 11 ? match[1] : null;
    const embedUrl = vid
      ? `https://www.youtube.com/embed/${vid}?rel=0&showinfo=0`
      : url;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  getThumbnail(url: string): string {
    // Generate a YouTube thumbnail or fallback placeholder
    const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[1].length === 11) {
      return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
    }
    return 'https://via.placeholder.com/120x70?text=No+Thumbnail';
  }

  isCompleted(content: Content): boolean {
    return this.completedVideos.has(content.id);
  }

  isLastVideo(): boolean {
    // True only when currentVideo is the last in the array
    const contents = this.course?.contents;
    return !!(
      contents &&
      this.currentVideo &&
      contents[contents.length - 1].id === this.currentVideo.id
    );
  }

  navigateToQuiz(): void {
    const courseId = this.course?.id;
    if (courseId != null) {
      this.router.navigate(['courses/courses', courseId, 'quiz']);
    }
  }

}
