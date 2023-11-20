import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {AuthService} from "../../../shared/services/auth/auth.service";
import {LoginPopupComponent} from "../../popups/login-popup/login-popup.component";
import {SignupPopupComponent} from "../../popups/signup-popup/signup-popup.component";
import {map, Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {UserService} from "../../../shared/services/user/user.service";
import {authState} from "@angular/fire/auth";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  isLogged = this.authService.getAuthState().pipe(
    map(authState => {
          if (authState?.uid != null) {
            return authState.uid;
          } else {
            return null;
          }
        }
    )
  );
  isUserMenuVisible: boolean = false;

  constructor(
      private authService: AuthService,
      private dialog: MatDialog,
  ) {
    this.authService.getAuthState().subscribe((user) => {
      console.log(user?.uid)
    })
  }

  ngOnInit(): void {
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
      }
    });
  }

  logout() {
    this.toggleDiv();
    this.authService.logout();
  }

  toggleDiv() {
    this.isUserMenuVisible = !this.isUserMenuVisible;
  }

}
