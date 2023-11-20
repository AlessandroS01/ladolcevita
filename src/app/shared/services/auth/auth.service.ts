import {Injectable, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat";
import FirebaseError = firebase.FirebaseError;


@Injectable({
  providedIn: 'root'
})
export class AuthService{
  constructor(
    public auth: AngularFireAuth
  ) {
    this.auth.authState.subscribe(user => {
      if (user) {
        localStorage.setItem('userUID', JSON.stringify(user.uid));
        JSON.parse(localStorage.getItem('userUID')!);
      } else {
        localStorage.setItem('userUID', 'null');
        JSON.parse(localStorage.getItem('userUID')!);
      }
    })
  }

  getAuthState() {
    return this.auth.authState;
  }


  async login(email: string, password: string): Promise<boolean | string> {
    return this.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        return true;
      })
      .catch((error) => {
        console.error('Login failed', error.code);
        return (error as FirebaseError).code;
      });
  }

  async signUp(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        return true;
      })
      .catch((error) => {
        console.error('Login failed', error.code);
        return (error as FirebaseError).code;
      });
  }

  async recoverPassword(email: string): Promise<boolean | string> {
    return this.auth.sendPasswordResetEmail(email)
      .then((result) => {
        return true;
      })
      .catch((error) => {
        console.error('Login failed', error.code);
        return (error as FirebaseError).code;
      });

  }

  logout() {
    this.auth.signOut()
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.error('Logout failed', error.code);
          return (error as FirebaseError).code;
        });
  }

}
