import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {User} from "../../../models/user/user.model";
import {map} from "rxjs";
import {Event} from "../../../models/event/event";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private dbPath: string = '/events';
  eventsRef: AngularFirestoreCollection<Event>;

  constructor(private db: AngularFirestore) {
    this.eventsRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<Event> {
    return this.eventsRef;
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

  create(event: Event, uid: string): any {
    return this.eventsRef.doc(uid).set({ ...event });
  }

  update(id: string, event: Event): Promise<void> {
    return this.eventsRef.doc(id).update({ ...event });
  }

  delete(id: string): Promise<void> {
    return this.eventsRef.doc(id).delete();
  }
}
