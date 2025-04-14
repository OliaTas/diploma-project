import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentType } from 'src/types/comment.type';
import { DefaultResponseType } from 'src/types/default-response.type';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  getComments(articleId: string, offset: number,): Observable<CommentType> {
    const params = new HttpParams()
      .set('article', articleId)
      .set('offset', offset.toString());

    return this.http.get<CommentType>(environment.api + 'comments', { params });
  }

  addComment(articleId: string, text: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments',
      {
        article: articleId,
        text: text
      },
    )
  }


}
