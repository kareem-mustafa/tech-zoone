import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  message = '';
  error = '';
  resetLink: string | null = null;
  loading = false;

  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // 🟢 امسح الرسائل بمجرد ما يحصل تعديل في الفورم
    this.forgotForm.valueChanges.subscribe(() => {
      this.message = '';
      this.error = '';
    });
  }

  get f() {
    return this.forgotForm.controls;
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.loading = true;
    this.message = '';
    this.error = '';

    const email = this.forgotForm.value.email!;
    this.authService.forgetPassword(email).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.resetLink = res.message;
        this.message = 'Email exist. Check your email for the reset link';
        this.error = '';
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error.message || 'Email not found';
        this.message = '';
        this.resetLink = null;
      },
    });
  }
}
