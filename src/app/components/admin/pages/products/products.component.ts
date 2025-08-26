import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from 'src/app/services/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private adminService: AdminService
  ) {}
  products: Product[] = [];
  editForm!: FormGroup;
  showEditModal = false;
  currentProduct!: Product;

  ngOnInit(): void {
    this.adminService.getProducts().subscribe({
      next: (products) => {
        this.products = products as Product[];
      },
      error: (err) => console.error('Error fetching products:', err),
    });
  }

  deleteProduct(slug: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(slug).subscribe({
        next: () => {
          this.products = this.products.filter((p) => p.slug !== slug);
        },
        error: (err: any) => console.error('Error deleting product', err),
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

    this.adminService
      .updateProduct(this.currentProduct.slug, updatedProduct)
      .subscribe({
        next: () => {
          // بعد التحديث نعمل fetch للمنتجات من جديد
          this.adminService.getProducts().subscribe({
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
