import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SellerDashboardService } from '../../../services/seller-dashboard.service';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css'],
})
export class AddProductsComponent implements OnInit {
  addForm!: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private sellerService: SellerDashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: this.fb.group({
        name: ['', Validators.required],
      }),
      brand: ['', Validators.required],
      Images: [null],
    });
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.addForm.patchValue({ Images: file });
    }
  }

  onSubmit() {
    if (this.addForm.invalid) return;

    this.submitting = true;

    const formData = new FormData();
    formData.append('title', this.addForm.value.title);
    formData.append('description', this.addForm.value.description);
    formData.append('price', this.addForm.value.price);
    formData.append('stock', this.addForm.value.stock);
    formData.append('category[name]', this.addForm.value.category.name);
    formData.append('brand', this.addForm.value.brand);

    if (this.addForm.value.Images) {
      formData.append('images', this.addForm.value.Images);
    }

    this.sellerService.addProduct(formData).subscribe({
      next: (res) => {
        console.log('Product added:', res);
        this.router.navigate(['/seller/products']); // الرجوع للصفحة الرئيسية للمنتجات
      },
      error: (err) => {
        console.error('Error adding product:', err);
        this.submitting = false;
      },
    });
  }
}
