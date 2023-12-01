import { Injectable } from '@angular/core';
import firebase from "firebase/compat";
import Firestore = firebase.firestore.Firestore;
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {User} from "../../../models/user/user.model";
import {map, Subscription} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private dbPath = '/users';
  usersRef: AngularFirestoreCollection<User>;

  constructor(private db: AngularFirestore) {
    this.usersRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<User> {
    return this.usersRef;
  }

  getUserById(uid: string) {
    return this.usersRef.doc(uid).get();
  }
  getUserByEmail(email: string) {
    return this.db.collection(
        this.dbPath,
        ref =>
          ref.where('email', '==', email)
    ).get().pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          return snapshot.docs[0].data() as User;
        } else {
          return null;
        }
      }
      )
    );
  }

  create(user: User, uid: string, admin: boolean): any {
    user.isAdmin = admin;

    return this.usersRef.doc(uid).set({ ...user });
  }

  update(id: string, user: User): Promise<void> {
    return this.usersRef.doc(id).update({ ...user });
  }

  delete(id: string): Promise<void> {
    return this.usersRef.doc(id).delete();
  }
}
