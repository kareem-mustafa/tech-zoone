import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/services/product.service';
import { SellerDashboardService } from '../../../services/seller-dashboard.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  constructor(
    private sellerDashboardService: SellerDashboardService,
    private fb: FormBuilder
  ) {}

  products: Product[] = [];
  editForm!: FormGroup;
  showEditModal = false;
  currentProduct!: Product;

  ngOnInit(): void {
    this.sellerDashboardService.getProducts().subscribe({
      next: (products) => {
        this.products = products as Product[];
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
          console.log('Product deleted successfully');
          // شيل المنتج من الليستة بعد الحذف
          this.products = this.products.filter((p) => p.slug !== slug);
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
    this.showEditModal = true;
  }
  onSubmitEdit() {
    if (this.editForm.invalid) return;

    const updatedProduct = {
      ...this.currentProduct,
      ...this.editForm.value,
    };

    this.sellerDashboardService
      .updateProduct(this.currentProduct.slug, updatedProduct)
      .subscribe({
        next: () => {
          // بعد التحديث نعمل fetch للمنتجات من جديد
          this.sellerDashboardService.getProducts().subscribe({
            next: (products) => {
              this.products = products as Product[];
              this.closeModal();
            },
            error: (err) =>
              console.error('Error fetching products after update:', err),
          });
        },
        error: (err) => console.error('Error updating product:', err),
      });
  }

  closeModal() {
    this.showEditModal = false;
    this.editForm.reset();
  }
}
