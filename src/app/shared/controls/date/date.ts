import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

// Custom validator function
export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const date = new Date(control.value);
    if (date) {
      if (date <= new Date()) {
        return {'futureDateValidation': true}
      } else {
        return null;
      }
    }
    return null;
  }

}
