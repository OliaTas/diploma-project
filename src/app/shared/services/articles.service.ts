import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PopularArticleType } from 'src/types/popular-article.type';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) { }

  getPopularArticle(): Observable<PopularArticleType[]> {
    return this.http.get<PopularArticleType[]>(environment.api + 'articles/top');
  }
}
