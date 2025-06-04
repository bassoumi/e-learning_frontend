import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Instructor } from 'src/app/core/models/instructor';
import { AdminService } from '../service/admin.service';
import { InstructorService } from '../../instructors/services/instructor.service';

@Component({
  selector: 'app-info-instructor',
  templateUrl: './info-instructor.component.html',
  styleUrls: ['./info-instructor.component.scss']
})
export class InfoInstructorComponent {

  instructorId!: number;
  instructor!: Instructor;
  isLoading: boolean = true;
  errorMsg: string = '';

  constructor(
    private route: ActivatedRoute,
    private instructorService: InstructorService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.instructorId = +id;
        this.loadInstructorDetails(this.instructorId);
      }
    });
  }

  loadInstructorDetails(id: number): void {
    this.instructorService.getInstructorById(id).subscribe({
      next: (data) => {
        this.instructor = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = "Instructeur introuvable.";
        this.isLoading = false;
      }
    });
  }

}
