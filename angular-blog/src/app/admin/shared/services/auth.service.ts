import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FbAuthResponse, User} from '../../../shared/interfaces';
import {Observable, Subject, throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class AuthService {
  public error$: Subject<string> = new Subject<string>();
  constructor(private http: HttpClient) { }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      );
  }
  logout() {
    this.setToken(null);
  }
  get token(): string {
    const expiresDate = new Date(localStorage.getItem('fb-token-expires'));
    if (new Date() > expiresDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }
  handleError(error: HttpErrorResponse) {
    const {message} = error.error.error;
    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Wrong email address!');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Invalid password, try again!!');
        break;
      case 'EMAIL_NOT_FOUND':
        this.error$.next('This user isn\'t exists');
        break;
    }
    return throwError(error);
  }
  private setToken(response: FbAuthResponse | null) {
    if (response) {
      const expireDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-expires', expireDate.toString());
    } else {
      localStorage.clear();
    }
  }
  isAuthenticated(): boolean {
    return !!this.token;
  }
}
