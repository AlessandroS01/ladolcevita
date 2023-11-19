import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {AuthService} from "../../services/auth/auth.service";
import {LoginPopupComponent} from "../../popups/login-popup/login-popup.component";
import {SignupPopupComponent} from "../../popups/signup-popup/signup-popup.component";
import {Router} from "@angular/router";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {
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
      if (message == 'login successful') {
        return;
      }
    });
  }

  openSignUp() {
    const popup = this.dialog.open(SignupPopupComponent, {
      height: '80%',
      enterAnimationDuration: '0.2s',
      exitAnimationDuration: '0.2s'
    });

    popup.afterClosed().subscribe( message => {
      if (message == 'login') {
        this.openLogin()
      }
      if (message == 'signup successful') {
        window.alert("A");
        return;
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {
  }
}
