import { AbstractControl,  AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { AudioService } from '../audio/audio.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class AudioNameValidator {

  constructor() {}

  static checkDuplicateAudioName(audioService: AudioService, userValue: string|null):  AsyncValidatorFn {
    return (control: AbstractControl): Observable <ValidationErrors | null>  => {
      const username = control.value;
      if (username.length > 3 && (userValue != null && username !== userValue)) {
        return audioService
          .getAudioByName(control.value)
          .map(
            response => {
              const result =  (response.json() != null) ? { checkDuplicateAudioName: true } : null;
              return result;
            }
          );
      } else {
        return Observable.of(null);
      }
    };
  }
}
