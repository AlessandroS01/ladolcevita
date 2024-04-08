import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {User} from "../../../models/user/user.model";
import {Member} from "../../../models/member/member";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {from, map, Observable, switchMap, take} from "rxjs";
import {Article} from "../../../models/article/article";

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private dbPath = '/members';
  private storagePath = '/about_page/members';

	private dbPathArticles: string = '/articles';
	articlesRef: AngularFirestoreCollection<Article>;

  membersRef: AngularFirestoreCollection<Member>;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.membersRef = db.collection(this.dbPath);
		this.articlesRef = db.collection(this.dbPathArticles);
  }

  getAll(): Observable<Member[]> {
    return this.membersRef.valueChanges();
  }

  getMemberByUid(uid: string) {
    return this.membersRef.doc(uid).get();
  }
	getDocumentAndMemberByEmail(email: string): Observable<{ documentId: string | null, memberData: Member | null }> {
		return this.db.collection(
			this.dbPath,
			ref => ref.where('email', '==', email)
		).get().pipe(
			map(snapshot => {
				if (!snapshot.empty) {
					const doc = snapshot.docs[0];
					return {
						documentId: doc.id,
						memberData: doc.exists ? doc.data() as Member : null
					};
				} else {
					return { documentId: null, memberData: null };
				}
			})
		);
	}

  getMemberPhoto(fileName: string) {
    const reference =
      this.storage.ref(this.storagePath + "/" + fileName);
    return reference.getDownloadURL();
  }

  create(
		newMember: Member
  ): Observable<string> {
	  const memberObject: any = this.transformMemberObject(newMember);

	  return from(this.membersRef.doc(newMember.email).set(memberObject)
		  .then(() => newMember.email as string));
  }

  update(
		oldMember: Member,
		memberUid: string,
		updatedMember: Member
  ): Observable<void> {
		this.changeEmailValueArticles(oldMember.email!, updatedMember.email!);

	  const memberObject: any = this.transformMemberObject(updatedMember);

	  return from(this.membersRef.doc(memberUid).set({ ...memberObject }));
  }

  delete(id: string): Promise<void> {
    return this.membersRef.doc(id).delete();
  }

	getAllMembersPhotoNames() {
		const storageRef = this.storage.ref(this.storagePath);
		return storageRef.listAll().pipe(
			map(result => {
				return result.items.map(item => item.name);
			})
		);
	}

	deleteFile(updatedMember: Member, oldPhoto: string) {
		const reference = this.storage.ref(`${this.storagePath}/${oldPhoto}`);

		return reference.delete();
	}

	private transformMemberObject(updatedMember: Member) {
		const memberObject: any = { ...updatedMember };

		return memberObject;
	}

	uploadFile(file: File) {
		const filePath = `${this.storagePath}/${file.name}`;

		const fileRef = this.storage.ref(filePath);
		return fileRef.put(file).percentageChanges();
	}

	private changeEmailValueArticles(oldEmail: string, newEmail: string): Promise<void> {
		const querySnapshotPromise = this.articlesRef.ref.where('email', '==', oldEmail).get();

		return querySnapshotPromise.then(querySnapshot => {
			const promises = querySnapshot.docs.map(doc =>
				this.articlesRef.doc(doc.id).update({ email: newEmail })
			);

			return Promise.all(promises).then(() => {});
		});
	}
}
