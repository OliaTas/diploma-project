import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefaultResponseType } from 'src/types/default-response.type';
import { UserType } from 'src/types/user.type';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

    getUserInfo(): Observable<DefaultResponseType | UserType> {
      return this.http.get<DefaultResponseType | UserType>(environment.api + 'users', { withCredentials: true });
    }
}
