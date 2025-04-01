import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefaultResponseType } from 'src/types/default-response.type';
import { LoginResponseType } from 'src/types/login-response.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public accessTokenKey: string = 'accessToken';
  private refreshTokenKey: string = 'refreshToken';
  private userIdKey: string = 'userId';
  private userNameKey: string = 'userName';

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged = false;

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email, password, rememberMe
    });
  }

  signup(email: string, password: string, name: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      email, password, name
    });
  }


  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken
      });
    }
    throw throwError(() => { 'Can not find token'; });
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken
      });
    }

    throw throwError(() => { 'Can not find token'; });
  }

  public getLoggedIn(): boolean {
    return this.isLogged;
  }


  public setTokens(accessToken: string, refreshToken: string, userName?: string | null): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    if (userName) {
      localStorage.setItem(this.userNameKey, userName);
    }
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  get userName(): string | null {
    return localStorage.getItem(this.userNameKey);
  }

  set userName(name: string | null) {
    if (name) {
      localStorage.setItem(this.userNameKey, name);
    } else {
      localStorage.removeItem(this.userNameKey);
    }
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userNameKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    };
  }

  get userId(): null | string {
    return localStorage.getItem(this.userIdKey);
  }

  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

}
