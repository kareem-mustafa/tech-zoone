import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  token!: string;
  message = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';

    this.resetForm = this.fb.group(
      {
        newpassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    this.resetForm.valueChanges.subscribe(() => {
      this.error = '';
      this.message = '';
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.resetForm.controls;
  }

  passwordMatchValidator(form: AbstractControl) {
    const pwd = form.get('newpassword')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pwd === confirm ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const newpassword = this.f['newpassword'].value;

    this.authService.resetPassword(this.token, newpassword).subscribe({
      next: () => {
        this.message = 'Password updated successfully!';
        this.error = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to reset password';
        this.message = '';
      },
    });
  }
}
