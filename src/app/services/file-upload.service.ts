import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private baseUrlUpload = `${environment.api + 'uploadImage.php' + '?API_KEY=' + environment.api_key}`;
  private baseUrlDelete = `${environment.api + 'deleteImage.php' + '?API_KEY=' + environment.api_key}`;

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<any> {
    const formData: any = new FormData();
    formData.append('image', file);

    return this.http.post(this.baseUrlUpload, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteImage(name: string): Observable<any> {
    const formData: any = new FormData();
    formData.append('name', name);
    return this.http.post(this.baseUrlDelete, formData);
  }
}
