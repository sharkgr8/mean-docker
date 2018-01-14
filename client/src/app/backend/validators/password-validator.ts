import {AbstractControl, ValidatorFn} from '@angular/forms';

export function MatchPassword(confirmControl): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    // const forbidden = nameRe.test(control.value);
    // return forbidden ? {'forbiddenName': {value: control.value}} : null;
    if (!control['_parent']) {
      return null;
    }
    if (!control['_parent'].controls[confirmControl]) {
        throw new TypeError('Form Control ' + confirmControl + ' does not exists.');
    }

    const controlMatch = control['_parent'].controls[confirmControl];

    return controlMatch.value === control.value ? null : {
      MatchPassword: true
    };
  };
}
