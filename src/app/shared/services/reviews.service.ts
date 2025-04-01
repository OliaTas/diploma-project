import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private http: HttpClient) { }
  
    // getReviews(): Observable<PopularArticleType[]> {
    //   return this.http.get<PopularArticleType[]>(environment.api + 'articles/top');
    // }
}
