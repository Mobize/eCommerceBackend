import { CategoriesService } from './../../services/categories.service';
import { Product } from './../../models/product';
import { Component, Input, OnDestroy, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { Subscription } from 'rxjs';
import { Response } from '../../models/response';
// import '@cds/core/icon/register.js';
// import { ClarityIcons, userIcon } from '@cds/core/icon';

// ClarityIcons.addIcons(userIcon);

@Component({
  selector: 'app-add-or-edit-product-modal',
  templateUrl: './add-or-edit-product-modal.component.html',
  styleUrls: ['./add-or-edit-product-modal.component.css']
})
export class AddOrEditProductModalComponent implements OnInit,OnChanges, OnDestroy {

  @Input() product: Product;
  @Output() finish = new EventEmitter();
  productForm: FormGroup;
  categories: Category[];
  categorySub: Subscription;
  idCategory = 1;
  file: File;

  constructor(private fb: FormBuilder, private categoriesService: CategoriesService) {
    this.productForm = fb.group({
      productInfos: fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', Validators.required],
        stock: ['', Validators.required]
      }),
      illustration: fb.group({
        image: ['', Validators.required]
      })
    });
   }

  selectCategory(id: number): void {
  this.idCategory = id;
  }

  get isProductInfosInvalid(): boolean {
  return this.productForm.get('productInfos').invalid;
  }

  get isIllustrationInvalid(): boolean {
    if (this.product) {
      return false;
    }
    return this.productForm.get('illustration').invalid;
  }

  handleCancel(): void {
    this.finish.emit();
    this.close();
  }

  handleFinish(): void {
    const product = {
      ...this.productForm.get('productInfos').value,
      ...this.productForm.get('illustration').value,
      category: this.idCategory,
      oldImage: null
    };

    if (this.product) {
      product.oldImage = this.product.oldImage;
    }

    if (this.file) {
      product.image = this.file.name;
    }else {
      product.image = this.product.oldImage;
    }

    this.finish.emit({product, file: this.file ? this.file : null});
    this.close();
    // console.log(product);

  }

  close(): void {
    this.productForm.reset();
    this.idCategory = 1;
  }

  detectFiles(event): void {
  this.file = event.target.files[0];
  }

  updateForm(product: Product): void {
    this.productForm.patchValue({
      productInfos: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock
      }
    });
    product.oldImage = product.image;
    this.selectCategory(product.Category);
  }

  ngOnChanges(): void {
    if (this.product) {
      this.updateForm(this.product);
    }
  }

  ngOnInit(): void {
    this.categorySub = this.categoriesService.getCategory().subscribe(
      (response: Response) => {
        this.categories = response.result;
      },
      (error) => {

      }
    )
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }

}
