import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpInterceptor } from '../shared/services/http-interceptor';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';



import { config } from '../backend.config';

@Injectable()
export class AuthenticationService {
    public token: string;
    public loggedInUsername: string;
    private API: string;
    private adminCheck: boolean;

    constructor(private http: HttpInterceptor) {
        // set token if saved in local storage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
        this.loggedInUsername = currentUser && currentUser.name;
        this.adminCheck = currentUser && currentUser.admin;
        this.API = config.API_URL;
    }

    login(username: string, password: string): Observable<boolean> {
        return this.http.post(`${this.API}/api/authenticate`, { username: username, password: password })
            .pipe(map((response: Response) => {
                // login successful if there's a jwt token in the response
                const token = response.json() && response.json().token;
                if (token) {
                    // set token property
                    this.token = token;
                    const loggedInUser = response.json().loggedInUser;
                    this.loggedInUsername = loggedInUser.name;
                    this.adminCheck = loggedInUser.admin;
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, name: loggedInUser.name,
                      admin: loggedInUser.admin, token: token }));

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            }));
    }

    getLoggedInUserName(): Observable<string> {
      return of(this.loggedInUsername);
    }

    getLoggedInToken(): Observable<string> {
      return of(this.token);
    }

    isLoggedIn(): Observable<boolean> {
      return of(this.token ? true : false);
    }

    isAdmin(): Observable<boolean> {
      return of(this.token ? this.adminCheck : false);
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }
}
