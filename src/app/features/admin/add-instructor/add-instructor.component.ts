import { Component } from '@angular/core';
import { AuthResponse } from 'src/app/core/models/user.model';
import { AdminService } from '../service/admin.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-instructor',
  templateUrl: './add-instructor.component.html',
  styleUrls: ['./add-instructor.component.scss']
})
export class AddInstructorComponent {
  instructorForm: FormGroup;
  profileImage!: File;
  successMsg: string = '';
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {
    this.instructorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      bio: ['']
    });
  }

  onFileSelected(event: any): void {
    this.profileImage = event.target.files[0];
  }

  onSubmit(): void {
    if (this.instructorForm.invalid) return;

    const formData = new FormData();
    Object.entries(this.instructorForm.value).forEach(([key, value]) => {
      formData.append(key, value == null ? '' : String(value));
    });
    if (this.profileImage) {
      formData.append('profileImage', this.profileImage);
    }

    this.adminService.registerInstructor(formData).subscribe({
      next: () => {
        this.successMsg = "Instructeur enregistré avec succès.";
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err.error?.message || "Erreur lors de l'enregistrement.";
      }
    });
  }
}
