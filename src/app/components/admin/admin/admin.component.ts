import {Component, OnInit} from '@angular/core';
import {User} from "../../../shared/models/user/user.model";
import {ParticipantService} from "../../../shared/services/model/participant/participant.service";
import {Participant, ParticipantFulfilled} from "../../../shared/models/participant/participant";
import {map, Observable, of} from "rxjs";
import {Utils} from "ngx-bootstrap/utils";





@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  user: User;
  participationFulfilled: ParticipantFulfilled[] = [];
  completeParticipation: Observable<ParticipantFulfilled[] | null>;

  page = 1;
  pageSize = 5;

  constructor(
    private participantService: ParticipantService
  ) {
    this.user = history.state;

    this.completeParticipation = this.participantService.getUserParticipationFulfilled().pipe(
      map(snapshot => (snapshot ? snapshot : null))
    );
    this.completeParticipation.subscribe(list => {
      if (list) {
        list.forEach(item  => {
          if (item.event?.date_time && item.event.date_time.toMillis() > Date.now()) {
            this.participationFulfilled.push(item);
          }
        })
        this.sortingArray();
      }
    });

  }

  handlePageChange(pageNumber: number): void {
    this.page = pageNumber;

    this.completeParticipation.subscribe(data => {
      if (data) {
        const startIndex = (this.page - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.participationFulfilled = data.slice(startIndex, endIndex);
      }
    });
  }


  onSelectChange(value: string): void {
    this.participationFulfilled = [];

    if (value == "1") {
      this.completeParticipation.subscribe(list => {
        if (list) {
          list.forEach(item  => {
            if (item.event?.date_time && item.event.date_time.toMillis() > Date.now()) {
              this.participationFulfilled.push(item);
            }
          })
        }
        this.sortingArray();
      });
    } else if (value == "2"){
      this.completeParticipation.subscribe(list => {
        if (list) {
          list.forEach(item  => {
            if (item.event?.date_time && item.event.date_time.toMillis() < Date.now()) {
              this.participationFulfilled.push(item);
            }
          })
        }
        this.sortingArray();
      });
    } else {
      this.completeParticipation.subscribe(list => {
        if (list) {
          list.forEach(item  => {
            if (item.event?.date_time) {
              this.participationFulfilled.push(item);
            }
          })
        }
        this.sortingArray();
      });
    }
  }

  sortingArray() {
    this.participationFulfilled.sort((a, b) => {
      if (a.event?.date_time && b.event?.date_time) {
        const dateA = a.event.date_time.toMillis();
        const dateB = b.event.date_time.toMillis();


        return dateA - dateB;
      }
      return 0;
    });
  }
}
