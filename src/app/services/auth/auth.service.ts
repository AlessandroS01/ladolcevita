import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: AngularFireAuth) { }

  get isAuthenticated(): boolean {
      return this.auth && this.auth.currentUser !== null;
  }

  login(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          // Sign up successful
        })
        .catch((error) => {
          console.log(error)
        });
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
