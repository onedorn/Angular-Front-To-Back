import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FbAuthResponse, User} from '../../../shared/interfaces';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {tap} from 'rxjs/operators';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken)
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
