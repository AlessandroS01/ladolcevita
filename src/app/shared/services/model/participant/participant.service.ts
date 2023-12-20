import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Participant, ParticipantFulfilled} from "../../../models/participant/participant";
import {forkJoin, map, Observable, of, switchMap, take} from "rxjs";
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

	getAllUIDs(): Observable<string[]> {
		return this.participantsRef.snapshotChanges().pipe(
			map(actions => {
				return actions.map(action => action.payload.doc.id);
			})
		);
	}

  create(participant: Participant) {
	  return this.getAllUIDs().pipe(
		  take(1),
		  switchMap(uids => {
			  let newUid = 1;

			  uids.forEach(uid => {
				  if (newUid === parseInt(uid)) {
					  newUid++;
				  }
			  });

			  const participationObj: any = {... participant};

			  return this.participantsRef.doc(newUid.toString()).set({ ...participationObj });
		  })
	  );
  }

  update(id: string, participant: Participant): Promise<void> {
    return this.participantsRef.doc(id).update({ ...participant });
  }

  delete(id: string): Promise<void> {
    return this.participantsRef.doc(id).delete();
  }

	getUserParticipationByEvent(eventId: string, email: string) {
		const database = this.db.firestore;
		return database.collection('/participants').where(
			'event', '==', eventId
		).where(
			'email', '==', email
		).get().then( snapshot=> {
			return !snapshot.empty;
		});
	}
}
