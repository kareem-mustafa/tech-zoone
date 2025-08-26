import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css'],
})
export class VerifyOtpComponent implements OnInit {
  otpForm!: FormGroup;
  userId!: string;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ⛔ لو مفيش صلاحية وصول (جاي من تسجيل) يرجعه للـ login
    const allowOtp = localStorage.getItem('allowOtp');
    if (allowOtp !== 'true') {
      this.router.navigate(['/login']);
      return;
    }

    this.userId = this.route.snapshot.paramMap.get('id') || '';

    this.otpForm = this.fb.group({
      lastOTP: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });
  }

  get f() {
    return this.otpForm.controls;
  }

  onSubmit() {
    if (this.otpForm.invalid) return;

    const body = {
      userId: this.userId,
      lastOTP: this.f['lastOTP'].value,
    };

    this.http.post('http://localhost:5000/user/verify', body).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || 'Verified successfully';

        // ✅ امسح الفلاج عشان ما ينفعش يدخل تاني
        localStorage.removeItem('allowOtp');

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'OTP verification failed';
      },
    });
  }

  resendOtp() {
    this.http
      .post(`http://localhost:5000/user/resend-otp/${this.userId}`, {})
      .subscribe({
        next: (res: any) => {
          this.successMessage = res.message || 'OTP resent successfully';
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to resend OTP';
        },
      });
  }
}
