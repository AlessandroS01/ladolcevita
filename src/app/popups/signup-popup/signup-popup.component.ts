import {Component, Inject} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-signup-popup',
  templateUrl: './signup-popup.component.html',
  styleUrls: ['./signup-popup.component.css']
})
export class SignupPopupComponent {
  passwordVisibility: boolean = false;
  confirmPassVisibility: boolean = false;

  signupForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(
        '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
      )
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
    confirmPassword: new FormControl('', Validators.required),
  },
  {
    validators: this.matchValidator('password', 'confirmPassword')
  });
  submitted: boolean = false;

  inputData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private ref: MatDialogRef<SignupPopupComponent>,
    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    this.inputData = this.data;
  }

  matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (matchingControl!.errors && !matchingControl!.errors?.['confirmedValidator']) {
        return null;
      }

      if (control!.value !== matchingControl!.value) {
        const error = { confirmedValidator: 'Passwords do not match.' };
        matchingControl!.setErrors(error);
        return error;
      } else {
        matchingControl!.setErrors(null);
        return null;
      }
    }
  }

  closePopup(message= '' ) {
    this.ref.close(message);
  }

  async submitForm() {
    const errorElement = document.getElementById('error');

    if (errorElement) {
      errorElement.textContent = '';
    }

    this.submitted = true;

    if (this.signupForm.invalid) {
      return;
    }

    const auth =
      await this.authService
        .signUp(this.signupForm.get('email')?.value, this.signupForm.get('password')?.value);

    if (typeof auth == "string") {

      const errorElement = document.getElementById('error');

      if (errorElement) {
        errorElement.textContent = auth;
        switch (auth) {
          case 'auth/email-already-in-use':
            errorElement.textContent = 'Email already used';
            break;
          default:
            errorElement.textContent = 'An unknown error occurred';
            break;
        }
      }
    } else {
      this.closePopup('signup successful');
    }
  }

  togglePasswordVisibility(pass = '') {

    if (pass == 'password'){
      this.passwordVisibility = !this.passwordVisibility;
    } else {
      this.confirmPassVisibility = !this.confirmPassVisibility;
    }

  }
}
