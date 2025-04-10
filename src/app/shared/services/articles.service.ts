import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActiveParamsType } from 'src/types/active-params.type';
import { ArticleType } from 'src/types/article.type';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) { }

  getPopularArticle(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }

  getArticles(params: { page?: number, categories?: string[] }): Observable<{ items: ArticleType[], pages: number }> {
    let httpParams = new HttpParams();
    
    if (params.page) {
      httpParams = httpParams.append('page', params.page.toString());
    }
    
    if (params.categories) {
      params.categories.forEach(category => {
        httpParams = httpParams.append('categories', category);
      });
    }
    
    return this.http.get<{ items: ArticleType[], pages: number }>(environment.api + 'articles', {
      params: httpParams
    });
  }

  getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url);
  }

  getRelatedArticles(url: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url);
  }
}
