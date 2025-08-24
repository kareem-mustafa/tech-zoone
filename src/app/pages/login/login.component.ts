import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  get f() {
    return this.loginForm.controls;
  }
  loading = false;

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    this.loading = true;

    this.authService
      .login(email, password)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token!);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Invalid email or password';
          this.loading = false;
        },
        complete: () => (this.loading = false),
      });
  }

  navigateToSignupUser() {
    this.router.navigate(['/signup-user']);
  }

  navigateToSignupSeller() {
    this.router.navigate(['/signup-seller']);
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  onGoogleLogin() {
    this.authService.googleAuth();
  }
}
