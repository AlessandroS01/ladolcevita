import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {User} from "../../../models/user/user.model";
import {forkJoin, from, map, Observable, of, switchMap, take} from "rxjs";
import {Event} from "../../../models/event/event";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private dbPath: string = '/events';
  eventsRef: AngularFirestoreCollection<Event>;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.eventsRef = db.collection(this.dbPath);
  }

  getAll(): Observable<Event[]> {
    return this.eventsRef.valueChanges();
  }

  getEventById(uid: string) {
    return this.eventsRef.doc(uid).get().pipe(
      map(snapshot => {
        if (snapshot.data != null) {
          return snapshot.data() as Event;
        } else {
          return null;
        }
      })
    );
  }

  getAllUIDs(): Observable<string[]> {
    return this.eventsRef.snapshotChanges().pipe(
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

  getCoverPhotoEvent(event: Event): Observable<string> {
    const reference =
      this.storage.ref(`${this.dbPath}/${event.id}/${event.photo}`);
    return reference.getDownloadURL();
  }

  create(event: Event): Observable<number> {
    return this.getAllUIDs().pipe(
      take(1),
      switchMap(uids => {
        let newUid = 1;

        uids.forEach(uid => {
          if (newUid === parseInt(uid)) {
            newUid++;
          }
        });

        const eventObject: any = this.transformEventObject(event, newUid);

        return this.eventsRef.doc(newUid.toString()).set({ ...eventObject })
          .then(() => newUid);
      })
    );
  }

  transformEventObject(event: Event, uid: number) {
    event.id = uid.toString();

    const eventObject: any = { ...event };

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
    oldEvent: Event,
    updatedEvent: Event

  ): Observable<void> {
    const eventObject: any = this.transformEventObject(updatedEvent, parseInt(oldEvent.id!));

    return from(this.eventsRef.doc(oldEvent.id).set({ ...eventObject }));
  }

  deleteFolder(id: string) {
    const folderPath = this.storage.ref(`${this.dbPath}/${id}`);
    folderPath.listAll().subscribe(result => {
      result.items.forEach(fileRef => {
        fileRef.delete();
      });

      this.eventsRef.doc(id).delete();

      const database = this.db.firestore;
      database.collection('/participants').where(
        'event', '==', id
      ).get().then(snapshot => {
        snapshot.forEach(doc=> {
          doc.ref.delete();
        })
      })
    })
  }


  deleteFile(updatedEvent: Event, namePhoto: string) {
    const reference = this.storage.ref(`${this.dbPath}/${updatedEvent.id}/${namePhoto}`);

    return reference.delete();
  }
}
