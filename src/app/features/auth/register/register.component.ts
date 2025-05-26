import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Router } from '@angular/router';
import { StudentRegister } from 'src/app/core/models/user.model';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  group,
} from '@angular/animations';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    trigger('stepAnimation', [
      transition(':increment', [
        // on entre de la droite
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':decrement', [
        // on entre de la gauche
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  currentStep = 0;             
  readonly maxStep = 2;  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router  
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      age:       [null, [Validators.required, Validators.min(0)]],
      gender:    ['', Validators.required],
      email:     ['', [Validators.required, Validators.email]],
      phone:     ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city:   ['', Validators.required],
        state:  ['', Validators.required],
      }),
      password:  ['', [Validators.required, Validators.minLength(6)]]
    });
  }



  next() {
    if (this.isStepValid(this.currentStep)) {
      this.currentStep = Math.min(this.currentStep + 1, this.maxStep);
    } else {
      // marque les controls de l’étape actuelle comme touched
      this.markStepTouched(this.currentStep);
    }
  }

  back() {
    this.currentStep = Math.max(this.currentStep - 1, 0);
  }

  isStepValid(step: number): boolean {
    const names = this.getFieldsForStep(step);
    return names.every(name => this.registerForm.get(name)?.valid);
  }

  markStepTouched(step: number) {
    this.getFieldsForStep(step).forEach(name => {
      this.registerForm.get(name)?.markAsTouched();
    });
  }
  getFieldsForStep(step: number): string[] {
    switch (step) {
      case 0: return ['firstName','lastName','age','gender'];
      case 1: return ['email','phone','address.street','address.city'];
      case 2: return ['address.state','password'];
      default: return [];
    }
  }



  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const user: StudentRegister = this.registerForm.value;
    this.authService.registerStudent(user).subscribe({
      next: res => {
        console.log('Registered successfully:', res);
        console.log('Token:', res.token);
        this.authService.storeToken(res.token);
        this.router.navigate(['/dashboard']); 

      },
      error: err => {
        console.error('Registration error:', err);
      }
    });
  }

}
