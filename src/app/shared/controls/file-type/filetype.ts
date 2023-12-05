import {AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

export function fileTypeValidator(allowedFormats: string[]): ValidatorFn {
  return (control: AbstractControl) : ValidationErrors | null => {
    const file = control.value;
    if (file) {
      const fileExtension = file.split('.').pop()?.toLowerCase();
      const formatsAllowed = new Set(allowedFormats);

      const matches = fileExtension && formatsAllowed.has(fileExtension);

      return matches ? null : { imageValidator: true };
    }
    return null;
  };
}
