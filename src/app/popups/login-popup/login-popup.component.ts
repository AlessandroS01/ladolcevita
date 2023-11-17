import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

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

  inputData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private ref: MatDialogRef<LoginPopupComponent>,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.inputData = this.data;
  }

  closePopup(message= '' ) {
    this.ref.close(message);
  }

  submitForm() {
    this.submitted = true;

    console.log(this.loginForm.valid);
  }

  saveData() {

  }

  togglePasswordVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
  }
}
