import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {LoginPopupComponent} from "../../popups/login-popup/login-popup.component";
import {SignupPopupComponent} from "../../popups/signup-popup/signup-popup.component";

@Injectable({
  providedIn: 'root'
})
export class AuthDialogService {

  constructor(private dialog: MatDialog) {}

  openLogin(data: any) {

    return this.dialog.open(LoginPopupComponent, {

      data: data

    });
  }

  openSignUp(data: any) {

    return this.dialog.open(SignupPopupComponent, {

      data: data

    });
  }
}
