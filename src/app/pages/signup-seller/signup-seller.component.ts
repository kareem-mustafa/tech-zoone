import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-seller',
  templateUrl: './signup-seller.component.html',
  styleUrls: ['./signup-seller.component.css'],
})
export class SignupSellerComponent {
  sellerForm: FormGroup;
  selectedbankAccountImage: File | null = null;
  selectedProfileImage: File | null = null;
  step = 1;
  loading = false;
  errorMessage: string | null = null;

  // previews
  profilePreview: string | null = null;
  bankAccountPreview: string | null = null;
  profileFileName: any;
  bankFileName: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.sellerForm = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(40),
            Validators.pattern(/^[A-Za-z\u0600-\u06FF.\-\s]{5,40}$/),
          ],
        ],
        storename: ['', Validators.required],
        age: [
          '',
          [Validators.required, Validators.min(18), Validators.max(100)],
        ],
        gender: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        address: ['', Validators.required],
        phonenumber: [
          '',
          [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
        ],
        BankAccount: [
          '',
          [Validators.required, Validators.pattern(/^[0-9]{14}$/)],
        ],
        bankAccountImage: [null, Validators.required],
        profileImage: [null, Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  // password match
  passwordsMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  get f() {
    return this.sellerForm.controls;
  }

  // bank image
  onbankImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!/\.(jpg|jpeg|png)$/i.test(file.name)) {
        this.errorMessage = 'Bank account image must be jpg, jpeg, or png';
        return;
      }
      this.selectedbankAccountImage = file;
      this.bankAccountPreview = URL.createObjectURL(file);
      this.sellerForm.patchValue({ bankAccountImage: file });
      this.sellerForm.get('bankAccountImage')?.updateValueAndValidity();
    }
  }

  // profile image
  onProfileImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!/\.(jpg|jpeg|png)$/i.test(file.name)) {
        this.errorMessage = 'Profile image must be jpg, jpeg, or png';
        return;
      }
      this.selectedProfileImage = file;
      this.profilePreview = URL.createObjectURL(file);
      this.sellerForm.patchValue({ profileImage: file });
      this.sellerForm.get('profileImage')?.updateValueAndValidity();
    }
  }

  // next step
  nextStep() {
    if (
      this.f['username'].invalid ||
      this.f['age'].invalid ||
      this.f['email'].invalid ||
      this.f['address'].invalid ||
      this.f['phonenumber'].invalid
    ) {
      this.sellerForm.markAllAsTouched();
      return;
    }
    this.step = 2;
  }

  prevStep() {
    this.step = 1;
  }

  // submit
  onSubmit() {
    if (this.sellerForm.invalid) {
      this.sellerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const formData = new FormData();
    Object.keys(this.sellerForm.controls).forEach((key) => {
      const value = this.sellerForm.get(key)?.value;
      if (value instanceof File) {
        formData.append(key, value, value.name);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    formData.append('role', 'seller');

    this.authService.signup(formData).subscribe({
      next: (res: any) => {
        this.loading = false;
        const userId = res.user?.id || res.user?._id;
        if (userId) {
          this.router.navigate(['/verify-otp', userId]);
        } else {
          this.errorMessage = 'Cannot get user ID for verification';
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed';
        this.loading = false;
      },
    });
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;

    // منع أي حاجة غير الأرقام 0–9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
