import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../../../shared/interfaces';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {tap} from 'rxjs/operators';
import {FbAuthResponse} from '../../../../environments/interface';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  login(user: User): Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken)
      );
  }
  logout() {

  }
  get token(): string {
    return '';
  }
  private setToken(res: FbAuthResponse) {
    console.log(res);
  }
  isAuthenticated(): boolean {
    return !!this.token;
  }
}
