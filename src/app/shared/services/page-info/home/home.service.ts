import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {Observable, map, from, switchMap, forkJoin} from "rxjs";
import {HomePageData} from "../../../interfaces/home_page/home-page-data";

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private dbPath = '/home_page';

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  getHomePageInfo() {
    return this.db.collection(this.dbPath).doc('page').get();
  }

  getDownloadURL(filePath: string): Observable<string> {
    const reference = this.storage.ref(filePath);
    return from(reference.getDownloadURL());
  }

  getSliderImages(): Observable<string[]> {
    const reference = this.storage.ref(this.dbPath + "/slider");

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


	deleteFile(filename: string) {
		const reference=
			this.storage.ref(
				this.dbPath + "/slider/" + filename
			).delete();
	}

	modifyHomePage(newHomePageInfo: HomePageData) {
		return this.db.collection(this.dbPath).doc('page').set({...newHomePageInfo})
	}

	uploadFile(file: File): Observable<number | undefined> {
		const filePath = `${this.dbPath}/slider/${file.name}`;
		const fileRef = this.storage.ref(filePath);

		return fileRef.put(file).percentageChanges();
	}
}
