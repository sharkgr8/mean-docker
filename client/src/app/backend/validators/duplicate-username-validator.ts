import { AbstractControl,  AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { AdminUserService } from '../adminusers/admin-user.service';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class UsernameValidator {

  constructor() {}

  static checkDuplicateUsername(userService: AdminUserService, userValue: string|null):  AsyncValidatorFn {
    return (control: AbstractControl): Observable <ValidationErrors | null>  => {
      const username = control.value;
      if (username.length > 3 && (userValue != null && username !== userValue)) {
        return userService
          .getUserfromUsername(control.value)
          .pipe(map(
            response => {
              const result =  (response.json() != null) ? { checkDuplicateUsername: true } : null;
              return result;
            }
          ));
      } else {
        return of(null);
      }
    };
  }
}
