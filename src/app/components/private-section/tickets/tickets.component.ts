import {Component, OnDestroy} from '@angular/core';
import {User} from "../../../shared/models/user/user.model";
import {ParticipantService} from "../../../shared/services/model/participant/participant.service";
import {AuthService} from "../../../shared/services/auth/auth.service";
import {ParticipantFulfilled} from "../../../shared/models/participant/participant";
import {Subscription} from "rxjs";
import {LanguageService} from "../../../shared/services/language/language.service";
import {Details} from "../../../shared/models/common/details-subparagraphs";

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: [
		'./tickets.component.css',
	  '../../../shared/global/css/admin-table-pages.css'
  ]
})
export class TicketsComponent implements OnDestroy {

	subscriptions: Subscription[] = [];
	mapEventInfoLang: Map<string, Details> = new Map();

	user: User = {};
	allParticipation: ParticipantFulfilled[] = [];
	filteredParticipation: ParticipantFulfilled[] = [];
	displayedParticipation: ParticipantFulfilled[] = [];

	page = 1;
	pageSize = 5;

	constructor(
		private participantService: ParticipantService,
		private authService: AuthService,
		private langService: LanguageService
	) {
		const subscription = this.authService.getLoggedUser().subscribe(user => {
			if (user != null) {
				this.user = user;
				this.participantService.getSpecificUserParticipationFulfilled(user.email!).subscribe( participation => {
					if (participation != null) {
						this.allParticipation = participation;
						this.filteredParticipation = participation.filter(item => {
							return item.event?.date_time && item.event.date_time.toDate().getTime() > Date.now()
						});

						this.sortingArray();

						this.langService.language.subscribe(lang => {
							this.populateMap(lang);
						})
					}
				});
			}
			this.subscriptions.push(subscription);
		});
	}

	ngOnDestroy(): void {
    this.subscriptions.forEach(sub=> sub.unsubscribe());
	}

	onSelectChange(value: string) {
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

	handlePageChange(pageNumber: number) {
		this.page = pageNumber;

		const startIndex = (this.page - 1) * this.pageSize;
		const endIndex = startIndex + this.pageSize;

		this.displayedParticipation = this.filteredParticipation.slice(startIndex, endIndex);
	}

	private populateMap(lang: string) {
		switch (lang) {
			case 'en': {
				this.allParticipation.forEach(part=> {
					this.mapEventInfoLang.set(
						part.event?.id!,
						part.event?.en!
					)
				})
				break;
			}
			case 'it': {
				this.allParticipation.forEach(part=> {
					this.mapEventInfoLang.set(
						part.event?.id!,
						part.event?.it!
					)
				})
				break;
			}
			case 'ko': {
				this.allParticipation.forEach(part=> {
					this.mapEventInfoLang.set(
						part.event?.id!,
						part.event?.ko!
					)
				})
				break;
			}
		}
	}
}

