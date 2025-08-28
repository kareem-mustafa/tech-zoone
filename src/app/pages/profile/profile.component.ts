import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { AuthService, User } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user!: User;
  loading = false;
  errorMessage: string | null = null;
  activeSection: 'account' | 'password' = 'account';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const localUser = this.authService.getUser();
    if (!localUser) return;
    this.user = localUser;

    this.profileForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
  }

  updatePassword() {
    if (
      this.profileForm.get('password')?.value !==
      this.profileForm.get('confirmPassword')?.value
    ) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const payload = {
      email: this.user.email,
      password: this.profileForm.get('currentPassword')?.value,
      newpassword: this.profileForm.get('password')?.value,
    };

    this.userService.updatePassword(payload).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Password updated successfully', 'Success');
        this.profileForm.reset();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Error updating password';
      },
    });
  }
}

