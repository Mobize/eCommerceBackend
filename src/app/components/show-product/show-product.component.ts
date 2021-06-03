import { Category } from './../../models/category';
import { environment } from './../../../environments/environment';
import { FileUploadService } from './../../services/file-upload.service';
import { ProductsService } from './../../services/products.service';
import { Product } from './../../models/product';
import { Component, Input, OnInit } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.css']
})
export class ShowProductComponent implements OnInit {

  @Input() products: Product[];
  productModalOpen = false;
  selectedProduct: Product;
  delete = false;
  productToBeDelete: Product;
  file: File;
  progress = 0;
  baseUrlImage = `${environment.api_image}`;

  constructor(private productService: ProductsService, private fileService: FileUploadService) { }

  ngOnInit(): void {
  }

  onEdit(product: Product): void {
    this.productModalOpen = true;
    this.selectedProduct = product;
  }

  onDelete(product: Product): void {
    this.delete = true;
    this.productToBeDelete = product;
  }

  addProduct(): void {
    this.selectedProduct = undefined;
    this.productModalOpen = true;
  }

  handleCancelDelete() {
    this.delete = false;
  }

  handleConfirmDelete() {
    this.productService.deleteProduct(this.productToBeDelete).subscribe(
      (data) => {
        if (data.status === 200) {
          this.fileService.deleteImage(this.productToBeDelete.image).subscribe(
            (data) => {
              console.log(data);

            }
          );
          console.log(data);

          const index = this.products.findIndex(p => p.idProduct === this.productToBeDelete.idProduct);
          this.products.splice(index, 1);
          console.log(index)

        } else {
          console.log(data.message);
        }
      }
    );
    this.handleCancelDelete();
  }

  handleFinish(event): void {
    const product = event?.product ? event.product : null;
    this.file = event?.file ? event.file : null;

    if (product) {
      if (this.selectedProduct) {
        // Edition produit
        product.idProduct = this.selectedProduct.idProduct;
        this.editProductToServer(product);
      } else {
        // Ajout produit
        this.addProductToServer(product);
      }
    }
    this.productModalOpen = false;
  }

  uploadImage(event: HttpEvent<any>) {
    return new Promise(
      (resolve, reject) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('requete envoyée avec succès');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            if (this.progress === 100) {
              resolve(true);
            }
            break;
          case HttpEventType.Response:
            console.log(event.body);
            setTimeout(() => {
              this.progress = 0;
            }, 1500);
        }
      }
    )
  }

  addProductToServer(product): void {
    this.productService.addProduct(product).subscribe(
      (data) => {
        if (data.status === 200) {
          // Mise à jour du front-end
          console.log(this.file)
          if (this.file) {
            this.fileService.uploadImage(this.file).subscribe(
              (event: HttpEvent<any>) => {
                this.uploadImage(event).then(
                  () => {
                    product.idProduct = data.args.lastInsertId;
                    product.Category = product.category;
                    this.products.push(product);
                  }
                );
              }
            );
          }

        } else {
          console.log(data);
        }
      }
    );
  }

  editProductToServer(product): void {
    this.productService.editProduct(product).subscribe(
      (data) => {
        if ( data.status === 200) {
          if (this.file) {
            this.fileService.uploadImage(this.file).subscribe(
              (event: HttpEvent<any>) => {
                this.uploadImage(event).then(
                  () => {
                    this.updateProducts(product);
                  }
                );
              }
            );
            // Suppression ancienne image
            this.fileService.deleteImage(product.oldImage).subscribe(
              (data) => {
                console.log(data);
              }
            );
          } else {
            this.updateProducts(product);
          }
        }else {
          console.log(data.message);
        }
      }
    );
  }

  updateProducts(product) {
    // Mise à jour du front
    const index = this.products.findIndex(p => p.idProduct === product.idProduct);
    product.Category = product.category;
    // Recréer le tableau de products
    this.products = [
      ...this.products.slice(0, index),
      product,
      ...this.products.slice(index + 1)
    ];
  }
}
