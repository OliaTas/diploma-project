import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActionType } from 'src/types/action.type';
import { DefaultResponseType } from 'src/types/default-response.type';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor(private http: HttpClient) { }

  getCommentActions(commentId: string): Observable<ActionType[]> {
    return this.http.get<ActionType[]>(environment.api + 'comments/' + commentId + '/actions');
  }

  getArticleCommentActions(articleId: string): Observable<ActionType[]> {
    return this.http.get<ActionType[]>(environment.api + 'comments/' + articleId + 'article-comment-actions',
      {
        params: new HttpParams().set('articleId', articleId)
      }
    );
  }

  applyActionComment(commentId: string, action: 'like' | 'dislike' | 'violate'): Observable< DefaultResponseType> {
    return this.http.post<DefaultResponseType>(
      environment.api + 'comments/' + commentId + '/apply-action',
      { action }
    );
  }

}
