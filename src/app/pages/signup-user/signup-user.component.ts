import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup-user',
  templateUrl: './signup-user.component.html',
  styleUrls: ['./signup-user.component.css'],
})
export class SignupUserComponent implements OnInit {
  signupForm!: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  profilePreview: string | null = null;
  profileFileName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = (params['token'] || '').trim();
      if (token) {
        localStorage.setItem('token', token);
        this.authService.setLoggedInStatus(true);
        this.router.navigate(['/home']);
      }
    });

    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phonenumber: ['', Validators.required], // نفس الحقل بدون تغيير
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        profileImage: [null, Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }

  passwordMatchValidator(form: AbstractControl) {
    const pwd = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pwd === confirm ? null : { passwordMismatch: true };
  }

  onProfileImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    if (!/\.(jpg|jpeg|png)$/i.test(file.name)) {
      this.errorMessage = 'Profile image must be jpg, jpeg, or png';
      return;
    }

    this.profileFileName = file.name;
    this.profilePreview = URL.createObjectURL(file);

    this.signupForm.patchValue({ profileImage: file });
    this.f['profileImage'].updateValueAndValidity();
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('username', this.f['name'].value);
    formData.append('email', this.f['email'].value);
    formData.append('phonenumber', this.f['phonenumber'].value);
    formData.append('password', this.f['password'].value);
    formData.append('confirmPassword', this.f['confirmPassword'].value);
    formData.append('profileImage', this.f['profileImage'].value);

    this.authService.signup(formData).subscribe({
      next: (res: any) => {
        this.loading = false;
        const userId = res.user?._id || res.user?.id;
        if (userId) {
          this.router.navigate(['/verify-otp', userId]);
        } else {
          this.errorMessage = 'Cannot get user ID for verification';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Signup failed';
      },
    });
  }
}
