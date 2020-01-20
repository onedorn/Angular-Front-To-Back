import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../../../shared/interfaces';
import {Observable} from 'rxjs';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  login(user: User): Observable<any> {
    return this.http.post('', user);
  }
  logout() {

  }
  get token(): string {
    return '';
  }
  private setToken() {

  }
  isAuthenticated(): boolean {
    return !!this.token;
  }
}
