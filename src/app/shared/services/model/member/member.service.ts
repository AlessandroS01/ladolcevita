import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {User} from "../../../models/user/user.model";
import {Member} from "../../../models/member/member";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private dbPath = '/members';
  private storagePath = '/about_page/members';

  membersRef: AngularFirestoreCollection<Member>;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.membersRef = db.collection(this.dbPath);
  }

  getAll(): Observable<Member[]> {
    return this.membersRef.valueChanges();
  }

  getMemberByUid(uid: string) {
    return this.membersRef.doc(uid).get();
  }

  getMemberPhoto(fileName: string) {
    const reference =
      this.storage.ref(this.storagePath + "/" + fileName);
    return reference.getDownloadURL();
  }

  create(user: User, uid: string, admin: boolean): any {
    user.isAdmin = admin;

    return this.membersRef.doc(uid).set({ ...user });
  }

  update(id: string, data: any): Promise<void> {
    return this.membersRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.membersRef.doc(id).delete();
  }
}
