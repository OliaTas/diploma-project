import { HttpClient } from '@angular/common/http';
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

  getActions(id: string): Observable<ActionType[] | DefaultResponseType> {
    return this.http.get<ActionType[] | DefaultResponseType>(environment.api + 'comments/' + id + '/actions');
  }

  getArticleCommentActions(articleId: string): Observable<ActionType[]> {
    return this.http.get<ActionType[]>(environment.api + 'comments/' + articleId + 'article-comment-actions');
  }

  applyAction(commentId: string, action: 'like' | 'dislike' | 'violate'): Observable<ActionType | DefaultResponseType> {
    return this.http.post<ActionType | DefaultResponseType>(
      environment.api + 'comments/' + commentId + '/apply-action',
      { action }
    );
  }

}
