import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {AuthService} from "../../services/auth/auth.service";
import {AuthDialogService} from "../../services/auth/auth-dialog.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginPopupComponent} from "../../popups/login-popup/login-popup.component";
import {SignupPopupComponent} from "../../popups/signup-popup/signup-popup.component";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(private authService: AuthService, private dialog: MatDialog) {
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  openLogin() {
    const popup = this.dialog.open(LoginPopupComponent, {
      enterAnimationDuration: '0.2s',
      exitAnimationDuration: '0.2s'
    });

    popup.afterClosed().subscribe( message => {
      if (message == 'register') {
        this.openSignUp()
      }
    });
  }

  openSignUp() {
    const popup = this.dialog.open(SignupPopupComponent, {
      enterAnimationDuration: '0.2s',
      exitAnimationDuration: '0.2s'
    });

    popup.afterClosed().subscribe( message => {
      if (message == 'login') {
        this.openLogin()
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {
  }
}
