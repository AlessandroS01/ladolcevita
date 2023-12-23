import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../../shared/models/user/user.model";
import {ParticipantService} from "../../../shared/services/model/participant/participant.service";
import {ParticipantFulfilled} from "../../../shared/models/participant/participant";
import {AuthService} from "../../../shared/services/auth/auth.service";
import {Subscription} from "rxjs";





@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: [
    './admin.component.css',
    '../../../shared/global/css/admin-table-pages.css'
  ]
})
export class AdminComponent implements OnDestroy {

	subscriptions: Subscription[] = [];

  user: User = {};
	allParticipation: ParticipantFulfilled[] = [];
	filteredParticipation: ParticipantFulfilled[] = [];
	displayedParticipation: ParticipantFulfilled[] = [];

  page = 1;
  pageSize = 5;

  constructor(
    private participantService: ParticipantService,
    private authService: AuthService
  ) {
	  const subscription = this.authService.getLoggedUser().subscribe(user => {
		  if (user != null) {
			  this.user = user;
			  this.participantService.getUserParticipationFulfilled().subscribe( participation => {
				  if (participation != null) {
					  this.allParticipation = participation;
					  this.filteredParticipation = participation.filter(item => {
						  return item.event?.date_time && item.event.date_time.toDate().getTime() > Date.now()
					  });

					  this.sortingArray();
				  }
			  });
		  }
		  this.subscriptions.push(subscription);
	  });

  }

	ngOnDestroy(): void {
		this.subscriptions.forEach(sub=> sub.unsubscribe());
	}

  handlePageChange(pageNumber: number): void {
	  this.page = pageNumber;

	  const startIndex = (this.page - 1) * this.pageSize;
	  const endIndex = startIndex + this.pageSize;

	  this.displayedParticipation = this.filteredParticipation.slice(startIndex, endIndex);
  }


  onSelectChange(value: string): void {
	  if (value == '1') {
		  this.filteredParticipation = this.allParticipation.filter(item => {
			  return item.event?.date_time && item.event.date_time.toDate().getTime() >= Date.now()
		  });
	  } else if (value == '2') {
		  this.filteredParticipation = this.allParticipation.filter(item => {
			  return item.event?.date_time && item.event.date_time.toDate().getTime() < Date.now()
		  });
	  } else {
		  this.filteredParticipation = this.allParticipation;
	  }

	  this.sortingArray();
  }

  sortingArray() {
    this.filteredParticipation.sort((a, b) => {
      if (a.event?.date_time && b.event?.date_time) {
        const dateA = a.event.date_time.toDate().getTime();
        const dateB = b.event.date_time.toDate().getTime();


        return dateA - dateB;
      }
      return 0;
    });

	  this.displayedParticipation = this.filteredParticipation;
	  this.page = 1;
  }
}
