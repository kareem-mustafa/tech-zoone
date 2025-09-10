import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/services/product.service';
import { SellerDashboardService } from '../../../services/seller-dashboard.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  editForm!: FormGroup;
  currentProduct!: Product;

  constructor(
    private sellerDashboardService: SellerDashboardService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.sellerDashboardService.getProducts().subscribe({
      next: (products) => {
        this.products = products as Product[];
        this.cd.detectChanges(); // يضمن تحديث الـ view فورًا
      },
      error: (err) => {
        console.error('Error fetching seller products:', err);
      },
    });
  }

  onDelete(slug: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.sellerDashboardService.deleteProduct(slug).subscribe({
        next: () => {
          this.products = this.products.filter((p) => p.slug !== slug);
          this.cd.detectChanges(); // تحديث فورًا
        },
        error: (err) => {
          console.error('Error deleting product:', err);
        },
      });
    }
  }

  onEdit(product: Product) {
    this.currentProduct = product;
    this.editForm = this.fb.group({
      title: [product.title, Validators.required],
      description: [product.description, Validators.required],
      price: [product.price, [Validators.required, Validators.min(0)]],
      stock: [product.stock, [Validators.required, Validators.min(0)]],
    });
    // المودال يفتح تلقائي بواسطة data-bs-toggle="modal"
  }

  onSubmitEdit() {
    if (this.editForm.invalid) return;

    const updatedProduct = { ...this.currentProduct, ...this.editForm.value };

    this.sellerDashboardService
      .updateProduct(this.currentProduct.slug, updatedProduct)
      .subscribe({
        next: () => {
          this.loadProducts(); // إعادة تحميل المنتجات مع detectChanges
          const modalCloseBtn = document.querySelector(
            '#editModal .btn-close'
          ) as HTMLElement;
          modalCloseBtn?.click(); // اغلاق المودال بعد الحفظ
        },
        error: (err) => console.error('Error updating product:', err),
      });
  }
}
