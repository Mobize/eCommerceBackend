import { Product } from './../models/product';
import { Response } from './../models/response';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private baseUrl = `${environment.api + 'products' + '?API_KEY=' + environment.api_key}`;
  private baseUrlUpdate = `${environment.api + 'updateProducts.php' + '?API_KEY=' + environment.api_key}`;
  private baseUrlDelete = `${environment.api + 'deleteProducts.php' + '?API_KEY=' + environment.api_key}`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Response> {
    return this.http.get<Response>(this.baseUrl);
  }

  addProduct(product): Observable<Response> {
    const params = new FormData();
    params.append('name', product.name);
    params.append('description', product.description);
    params.append('price', `${product.price}`);
    params.append('stock', `${product.stock}`);
    params.append('category', `${product.category}`);
    params.append('image', product.image);
    return this.http.post<Response>(this.baseUrl, params);
  }

  editProduct(product: Product): Observable<Response> {
    const url = this.baseUrlUpdate + this.constructURLParams(product);
    return this.http.get<Response>(url);
  }

  deleteProduct(product: Product): Observable<Response>  {
    const url = this.baseUrl + '&id=' + product.idProduct;
    const formData: any = new FormData();
    formData.append('id', product.idProduct);
    return this.http.post<Response>(this.baseUrlDelete, formData);
  }

  constructURLParams = (object) => {
    let result = '';
    // tslint:disable-next-line: forin
    for (const property in object) {
      result += `&${property}=${object[property]}`;
    }
    return result;
  }
}
