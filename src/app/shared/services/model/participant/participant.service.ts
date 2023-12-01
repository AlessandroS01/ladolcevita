import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Participant, ParticipantFulfilled} from "../../../models/participant/participant";
import {forkJoin, map, Observable, of, switchMap} from "rxjs";
import {EventService} from "../event/event.service";
import {UserService} from "../user/user.service";
import {User} from "../../../models/user/user.model";
import {Event} from "../../../models/event/event";

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  private dbPath: string = '/participants';
  participantsRef: AngularFirestoreCollection<Participant>;

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private db: AngularFirestore
  ) {
    this.participantsRef = db.collection(this.dbPath);
  }

  getAll(): Observable<Participant[]> {
    return this.participantsRef.valueChanges();
  }
  getUserParticipationFulfilled(): Observable<ParticipantFulfilled[] | null> {
    console.log("A")
    return this.getAll().pipe(
      switchMap(participants => {
        if (!participants || participants.length === 0) {
          return of(null);
        }

        const observables = participants
          .filter(item => item.email && item.event)
          .map(item => {
            return forkJoin({
              user: this.userService.getUserByEmail(item.email as string),
              event: this.eventService.getEventById(item.event as string).pipe(
                map(snapshot => {
                  return snapshot as Event | null;
                })
              )
            });
          });

        return forkJoin(observables).pipe(
          map(results => {
            const participationFulfilled: ParticipantFulfilled[] = [];
            results.forEach(({ user, event }) => {
              if (user && event) {
                participationFulfilled.push({ user, event });
              }
            });
            return participationFulfilled;
          })
        );
      })
    );
  }

  getParticipantById(uid: string) {
    return this.participantsRef.doc(uid).get();
  }

  create(participant: Participant, uid: string): any {
    return this.participantsRef.doc(uid).set({ ...participant });
  }

  update(id: string, participant: Participant): Promise<void> {
    return this.participantsRef.doc(id).update({ ...participant });
  }

  delete(id: string): Promise<void> {
    return this.participantsRef.doc(id).delete();
  }
}
