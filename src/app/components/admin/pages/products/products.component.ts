import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from 'src/app/services/product.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products = new MatTableDataSource<Product>();
  displayedColumns: string[] = ['title', 'price', 'category', 'actions'];
  loading = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (res: Product[]) => {
        this.products.data = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching products', err);
        this.loading = false;
      },
    });
  }

  deleteProduct(slug: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(slug).subscribe({
        next: () => {
          this.products.data = this.products.data.filter(
            (p) => p.slug !== slug
          );
        },
        error: (err: any) => console.error('Error deleting product', err), 
      });
    }
  }
}
