import { Injectable } from '@angular/core';
import firebase from "firebase/compat";
import Firestore = firebase.firestore.Firestore;
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {User} from "../../models/user/user.model";


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

  getUser(uid: string) {
    return this.usersRef.doc(uid).get();
  }

  create(user: User, uid: string): any {
    console.log(user);
    console.log({...user});
    return this.usersRef.doc(uid).set({ ...user });
  }

  update(id: string, data: any): Promise<void> {
    return this.usersRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.usersRef.doc(id).delete();
  }


}
