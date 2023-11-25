import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {Observable, map, from, switchMap, forkJoin} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  private dbPath = '/about_page';

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  getAboutPageInfo() {
    return this.db.collection(this.dbPath).doc('page').get();
  }

  getDownloadURL(filePath: string): Observable<string> {
    const reference = this.storage.ref(filePath);
    return from(reference.getDownloadURL());
  }

  getFilesFromFolder(folder:string): Observable<any[]> {
    const reference = this.storage.ref(this.dbPath + "/" + folder);
    return reference.listAll().pipe(
      switchMap(listResult => {
        const downloadUrls =
          listResult.items.map(
            item => this.getDownloadURL(item.fullPath)
          );
        return forkJoin(downloadUrls);
      })
    );
  }


}
