import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.css']
})
export class LoginPopupComponent implements OnInit{

  passwordVisibility: boolean = false;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(
        '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
      )
    ]),
    password: new FormControl('', [
      Validators.required,
    ])
  });
  submitted: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private ref: MatDialogRef<LoginPopupComponent>,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
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

    if (this.loginForm.invalid) {
      return;
    }

    const auth=
      await this.authService
        .login(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value);

    if (typeof auth == "string") {

      const errorElement = document.getElementById('error');

      if (errorElement) {
        switch (auth) {
          case 'auth/invalid-login-credentials':
            errorElement.textContent = 'Email and/or password incorrect';
            break;
          default:
            errorElement.textContent = 'An unknown error occurred';
            break;
        }
      }

    } else {
      this.closePopup('login successful');
    }
  }

  togglePasswordVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
  }


}
