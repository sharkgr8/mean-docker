
import { throwError as observableThrowError, Observable } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import {
  Http,
  Request,
  RequestOptions,
  RequestOptionsArgs,
  Response,
  XHRBackend
} from '@angular/http';
import { Injectable } from '@angular/core';

// operators




@Injectable()
export class HttpInterceptor extends Http {
  constructor(backend: XHRBackend, options: RequestOptions, public http: Http) {
    super(backend, options);
  }

  public request(
    url: string | Request,
    options?: RequestOptionsArgs
  ): Observable<Response> {
    return super.request(url, options).pipe(timeout(3000), catchError(this.handleError));
  }

  public handleError = (error: Response) => {
    // Do messaging and error handling here
    return observableThrowError(error);
  }
}
