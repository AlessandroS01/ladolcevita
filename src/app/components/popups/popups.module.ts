import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginPopupComponent} from "./login-popup/login-popup.component";
import {SignupPopupComponent} from "./signup-popup/signup-popup.component";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    LoginPopupComponent,
    SignupPopupComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    LoginPopupComponent,
    SignupPopupComponent
  ]
})
export class PopupsModule { }
