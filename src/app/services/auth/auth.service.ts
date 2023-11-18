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

  signUp(email: string, password: string) {
    this.auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
          // Sign up successful
        })
        .catch((error) => {
          console.log(error)
        });
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
