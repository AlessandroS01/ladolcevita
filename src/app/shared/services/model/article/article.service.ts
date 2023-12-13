import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {from, map, Observable, of, switchMap, take} from "rxjs";
import {Event} from "../../../models/event/event";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {Article} from "../../../models/article/article";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private dbPath: string = '/articles';
  articlesRef: AngularFirestoreCollection<Article>;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.articlesRef = db.collection(this.dbPath);
  }

  getAll(): Observable<Article[]> {
    return this.articlesRef.valueChanges();
  }

  getArticlesById(uid: string): Observable<Article | null> {
    return this.articlesRef.doc(uid).get().pipe(
      map(snapshot => {
        if (snapshot.data != null) {
          return snapshot.data() as Article;
        } else {
          return null;
        }
      })
    );
  }

  getAllUIDs(): Observable<string[]> {
    return this.articlesRef.snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => action.payload.doc.id);
      })
    );
  }

  uploadFile(file: File, uid: number): Observable<number | undefined> {
    const filePath = `${this.dbPath}/${uid}/${file.name}`;
    const fileRef = this.storage.ref(filePath);

    return fileRef.put(file).percentageChanges();
  }

  getCoverPhotoArticle(article: Article): Observable<string> {
    const reference =
      this.storage.ref(`${this.dbPath}/${article.id}/${article.photo}`);
    return reference.getDownloadURL();
  }

  create(article: Article): Observable<number> {
    return this.getAllUIDs().pipe(
      take(1),
      switchMap(uids => {
        let newUid = 1;

        uids.forEach(uid => {
          if (newUid === parseInt(uid)) {
            newUid++;
          }
        });

        const eventObject: any = this.transformArticleObject(article, newUid);

        return this.articlesRef.doc(newUid.toString()).set({ ...eventObject })
          .then(() => newUid);
      })
    );
  }

  transformArticleObject(article: Article, uid: number) {
    article.id = uid.toString();

    const eventObject: any = { ...article };

    eventObject.en = { ...eventObject.en };
    eventObject.it = { ...eventObject.it };
    eventObject.ko = { ...eventObject.ko };
    if (eventObject.en.subparagraphs) {
      eventObject.en.subparagraphs =
        eventObject.en.subparagraphs.map(
          (sub: any) => ({ ...sub })
        );
    }
    if (eventObject.it.subparagraphs) {
      eventObject.it.subparagraphs =
        eventObject.it.subparagraphs.map(
          (sub: any) => ({ ...sub })
        );
    }
    if (eventObject.ko.subparagraphs) {
      eventObject.ko.subparagraphs =
        eventObject.ko.subparagraphs.map(
          (sub: any) => ({ ...sub })
        );
    }

    return eventObject;
  }
  update(
    oldArticle: Article,
    updatedArticle: Article
  ): Observable<void> {
    const eventObject: any = this.transformArticleObject(updatedArticle, parseInt(oldArticle.id!));

    return from(this.articlesRef.doc(oldArticle.id).set({ ...eventObject }));
  }

  deleteFolder(id: string) {
    const folderPath = this.storage.ref(`${this.dbPath}/${id}`);
    folderPath.listAll().subscribe(result => {
      result.items.forEach(fileRef => {
        fileRef.delete();
      })

      this.articlesRef.doc(id).delete();
    })
  }


  deleteFile(updatedArticle: Article, namePhoto: string) {
    const reference = this.storage.ref(`${this.dbPath}/${updatedArticle.id}/${namePhoto}`);

    return reference.delete();
  }
}
