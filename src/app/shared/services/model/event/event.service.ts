import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {User} from "../../../models/user/user.model";
import {map, Observable, take} from "rxjs";
import {Event, Subparagraph} from "../../../models/event/event";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private dbPath: string = '/events';
  eventsRef: AngularFirestoreCollection<Event>;

  constructor(private db: AngularFirestore) {
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

  create(event: Event) {
    this.getAllUIDs().pipe(
      take(1)
    ).subscribe(uids=> {
      let newUid: number = 1;
      uids.forEach(uid=> {
        if (newUid == parseInt(uid)){
          newUid++;
        }
      })
      const eventObject: any = { ...event }; // Convert the Event object to a plain object
      eventObject.en = { ...eventObject.en }; // Convert the EventDetails object to a plain object
      eventObject.it = { ...eventObject.it }; // Convert the EventDetails object to a plain object
      eventObject.ko = { ...eventObject.ko }; // Convert the EventDetails object to a plain object
      if (eventObject.en.subparagraphs) {
        eventObject.en.subparagraphs =
          eventObject.en.subparagraphs.map(
              (sub: any) => ({ ...sub })
          ); // Convert the Subparagraph objects to plain objects
      }
      if (eventObject.it.subparagraphs) {
        eventObject.it.subparagraphs =
          eventObject.it.subparagraphs.map(
            (sub: any) => ({ ...sub })
          ); // Convert the Subparagraph objects to plain objects
      }
      if (eventObject.ko.subparagraphs) {
        eventObject.ko.subparagraphs =
          eventObject.ko.subparagraphs.map(
            (sub: any) => ({ ...sub })
          ); // Convert the Subparagraph objects to plain objects
      }

      this.eventsRef.doc(newUid.toString()).set({ ...eventObject});
    })
  }

  update(id: string, event: Event): Promise<void> {
    return this.eventsRef.doc(id).update({ ...event });
  }

  delete(id: string): Promise<void> {
    return this.eventsRef.doc(id).delete();
  }
}
