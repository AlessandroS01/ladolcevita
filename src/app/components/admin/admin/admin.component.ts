import {Component, OnInit} from '@angular/core';
import {User} from "../../../shared/models/user/user.model";
import {ParticipantService} from "../../../shared/services/model/participant/participant.service";
import {Participant, ParticipantFulfilled} from "../../../shared/models/participant/participant";
import {map, Observable, of} from "rxjs";
import {Utils} from "ngx-bootstrap/utils";
import {AuthService} from "../../../shared/services/auth/auth.service";





@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: [
    './admin.component.css',
    '../../../shared/global/css/admin-table-pages.css'
  ]
})
export class AdminComponent {

  user: User = {};
  participationFulfilled: ParticipantFulfilled[] = [];
  completeParticipation: ParticipantFulfilled[] = [];

  page = 1;
  pageSize = 5;

  constructor(
    private participantService: ParticipantService,
    private authService: AuthService
  ) {
     this.authService.getLoggedUser().subscribe(user => {
      if (user != null) {
        this.user = user;
      }
    })

    this.participantService.getUserParticipationFulfilled().subscribe( participations => {
      if (participations != null) {
        this.completeParticipation = participations;
        this.completeParticipation.forEach(item  => {
          if (item.event?.date_time && item.event.date_time.toDate().getTime() > Date.now()) {
            this.participationFulfilled.push(item);
          }
        });
        this.sortingArray();
      }
    });


  }

  handlePageChange(pageNumber: number): void {
    this.page = pageNumber;
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.participationFulfilled = this.completeParticipation.slice(startIndex, endIndex);
  }


  onSelectChange(value: string): void {
    this.participationFulfilled = [];

    if (value == "1") {
      this.completeParticipation.forEach(item  => {
        if (item.event?.date_time && item.event.date_time.toDate().getTime() > Date.now()) {
          this.participationFulfilled.push(item);
        }
      })
      this.sortingArray();
    } else if (value == "2"){
      this.completeParticipation.forEach(item  => {
        if (item.event?.date_time && item.event.date_time.toDate().getTime() < Date.now()) {
          this.participationFulfilled.push(item);
        }
      })
      this.sortingArray();
    } else {
      this.completeParticipation.forEach(item  => {
        if (item.event?.date_time) {
          this.participationFulfilled.push(item);
        }
      })
      this.sortingArray();
    }
  }

  sortingArray() {
    this.participationFulfilled.sort((a, b) => {
      if (a.event?.date_time && b.event?.date_time) {
        const dateA = a.event.date_time.toDate().getTime();
        const dateB = b.event.date_time.toDate().getTime();


        return dateA - dateB;
      }
      return 0;
    });
  }
}
