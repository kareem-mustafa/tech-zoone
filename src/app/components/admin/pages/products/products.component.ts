import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/services/product.service';
import { AdminService } from 'src/app/services/admin.service';

declare var bootstrap: any; // عشان نقدر نستخدم الـ bootstrap modal برمجياً

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  editForm!: FormGroup;
  currentProduct!: Product;
  editModalInstance: any; // instance للمودال

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    // تهيئة الفورم مرة واحدة
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
    });

    // ربط الـ modal بالـ bootstrap instance
    const modalEl = document.getElementById('editModal');
    if (modalEl) {
      this.editModalInstance = new bootstrap.Modal(modalEl);
    }
  }

  loadProducts() {
    this.adminService.getProducts().subscribe({
      next: (products) => {
        this.products = products as Product[];
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error fetching products:', err),
    });
  }

  deleteProduct(slug: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(slug).subscribe({
        next: () => {
          this.products = this.products.filter((p) => p.slug !== slug);
          this.cd.detectChanges();
        },
        error: (err) => console.error('Error deleting product:', err),
      });
    }
  }

  onEdit(product: Product) {
    this.currentProduct = product;
    this.editForm.patchValue({
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });

    // فتح المودال برمجياً
    this.editModalInstance.show();
  }

  onSubmitEdit() {
    if (this.editForm.invalid) return;

    const updatedProduct = { ...this.currentProduct, ...this.editForm.value };

    this.adminService.updateProduct(this.currentProduct.slug, updatedProduct).subscribe({
      next: () => {
        this.loadProducts(); // إعادة تحميل المنتجات
        this.editModalInstance.hide(); // اغلاق المودال بعد الحفظ
      },
      error: (err) => console.error('Error updating product:', err),
    });
  }
}
