import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat";
import FirebaseError = firebase.FirebaseError;


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: AngularFireAuth) { }

  get isAuthenticated(): boolean {
      return this.auth && this.auth.currentUser !== null;
  }

  async login(email: string, password: string): Promise<boolean | string> {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
      return true; // Successful login
    } catch (error) {
      return (error as FirebaseError).code;
    }
  }

  async signUp(email: string, password: string) {
    try {
      await this.auth.createUserWithEmailAndPassword(email, password);
      return true; // Successful login
    } catch (error) {
      return (error as FirebaseError).code;
    }
  }

  async recoverPassword(email: string): Promise<boolean | string> {
    return this.auth.sendPasswordResetEmail(email)
      .then((result) => {
        return true;
      })
      .catch((error) => {
        return (error as FirebaseError).code;
      });
    /*
    try {
      await this.auth.sendPasswordResetEmail(email);
      return true; // Successful login
    } catch (error) {
      return (error as FirebaseError).code;
    }
     */
  }

  logout() {
    this.auth.signOut()
        .then(() => {
            console.log("Successo");
        })
        .catch((error) => {
          console.log("Errore");
        });
  }
}
