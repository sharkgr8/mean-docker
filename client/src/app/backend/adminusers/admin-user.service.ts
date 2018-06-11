import { Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { HttpInterceptor } from '../shared/services/http-interceptor';
import { Observable } from 'rxjs';
import { config } from '../backend.config';
import { AuthenticationService } from '../login/auth.service';
import { AdminUser } from './admin-user';

@Injectable()
export class AdminUserService {
  public token: string;
  private API: string;
  private adminCheck: Boolean = false;

  constructor(private http: HttpInterceptor, private authService: AuthenticationService) {
    this.authService.getLoggedInToken().subscribe(result => this.token = result);
    this.authService.isAdmin().subscribe(result => this.adminCheck = result);
    this.API = config.API_URL + '/adminusers';
  }

  getTokenAttachedHeader(): RequestOptions {
    return new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'x-access-token': this.token
      })
    });
  }

  // 5. Function to return the Observable response containing all Users
  getUsers(): Observable<Response> {
    return this.http.get(this.API, this.getTokenAttachedHeader());
  }
  // 6. Function to perform POST operation to create a new user
  addUser(user: AdminUser): Observable<Response> {
    return this
      .http
      .post(this.API, user, this.getTokenAttachedHeader());
  }
  // 7. Function to update User using PUT operation
  updateUser(id: string, user: AdminUser): Observable<Response> {
    return this
      .http
      .put(this.API + `/` + id, JSON.stringify(user), this.getTokenAttachedHeader());
  }
  // 8. Function to remove the User using DELETE operation
  deleteUser(id: string): Observable<Response> {
    return this
      .http
      .delete(this.API + `/` + id, this.getTokenAttachedHeader());
  }

  getUserfromUsername(username: string): Observable<Response> {
    return this.http.get(this.API + '/username/' + username);
  }
}
