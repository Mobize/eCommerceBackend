import { Response } from './../../models/response';
import { ProductsService } from './../../services/products.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products;
  productSub;

  constructor(private productService: ProductsService) { }

  ngOnInit(): void {
    this.productSub = this.productService.getProducts().subscribe(
      (response: Response) => {
        this.products = response.result;
      },
      (error) => {
        console.log(error);
      }
    )
  }

}
