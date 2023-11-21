import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {AuthService} from "../../../shared/services/auth/auth.service";
import {LoginPopupComponent} from "../../popups/login-popup/login-popup.component";
import {SignupPopupComponent} from "../../popups/signup-popup/signup-popup.component";
import {map, Observable, of, Subscription, switchMap} from "rxjs";
import {Router} from "@angular/router";
import {UserService} from "../../../shared/services/user/user.service";
import {authState} from "@angular/fire/auth";
import {User} from "../../../shared/models/user/user.model";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  isLogged: Observable<string | null>;
  user: Observable<User | null>;

  isUserMenuVisible: boolean = false;

  constructor(
      private authService: AuthService,
      private dialog: MatDialog,
      private userService: UserService
  ) {
    this.isLogged = this.authService.getAuthState().pipe(
      map(authState => authState?.uid ?? null)
    );

    this.user = this.authService.getAuthState().pipe(
      map(user => user?.uid),
      switchMap(uid => {
        if (uid) {
          return this.userService.getUser(uid).pipe(
            map(snapshot => {
              if (snapshot.data() !== null) {
                const userObj = new User();
                const data = snapshot.data();

                userObj.name = data?.name;
                userObj.surname = data?.surname;
                userObj.email = data?.email;
                userObj.isAdmin = data?.isAdmin;

                return userObj;
              } else {
                return null;
              }
            })
          );
        } else {
          return of(null); // Return an Observable emitting null
        }
      })
    );
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

  upperCamelCase(input: string | undefined): string {
    if (!input) {
      return ''; // Handle the case when input is undefined or null
    }

    const lowerCaseString = input.toLowerCase();
    return lowerCaseString.charAt(0).toUpperCase() + lowerCaseString.slice(1);
  }

}
