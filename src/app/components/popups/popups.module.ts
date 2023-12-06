import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginPopupComponent} from "./login-popup/login-popup.component";
import {SignupPopupComponent} from "./signup-popup/signup-popup.component";
import {ReactiveFormsModule} from "@angular/forms";
import { LoadingPopupComponent } from './loading-popup/loading-popup.component';



@NgModule({
  declarations: [
    LoginPopupComponent,
    SignupPopupComponent,
    LoadingPopupComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    LoginPopupComponent,
    SignupPopupComponent,
    LoadingPopupComponent
  ]
})
export class PopupsModule { }
