import { Component } from '@angular/core';
import {EventService} from "../../shared/services/model/event/event.service";
import {Details} from "../../shared/models/common/details-subparagraphs";
import {LanguageService} from "../../shared/services/language/language.service";
import {Event} from "../../shared/models/event/event";


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: [
	  './../../shared/global/css/articles-events.css',
		'./events.component.css'
  ]
})
export class EventsComponent {

	allEvents: Event[] = [];
	eventsListDisplayed: Event[] = [];
	eventsListFiltered: Event[] = [];

	mapEventCoverPhoto: Map<string, string> = new Map();
	mapEventLanguage: Map<string, Details> = new Map();

	isDataLoaded: boolean = false;

	page = 1;
	pageSize = 4;

	constructor(
		private eventService: EventService,
		private languageService: LanguageService
	) {
		this.eventService.getAll().subscribe(events=> {
			this.allEvents = events;

			this.eventsListFiltered = this.allEvents.filter(event=> {
				return event.date_time?.toDate().getTime()! >= Date.now()
			});

			this.sortingEventList();

			this.languageService.language.subscribe(lang=> {
				this.populateMapLang(lang);
			})
			events.forEach(event=> {
				this.eventService.getCoverPhotoEvent(event).subscribe(photo=> {
					this.mapEventCoverPhoto.set(
						event.id!,
						photo
					);
				});
			});
			this.isDataLoaded = true;
		})
	}

	protected readonly events = module

	private populateMapLang(lang: string) {
		if (lang == 'en') {
			this.allEvents.forEach(event=> {
				this.mapEventLanguage.set(
					event.id!,
					event.en!
				)
			});
		}
		if (lang == 'it') {
			this.allEvents.forEach(event=> {
				this.mapEventLanguage.set(
					event.id!,
					event.it!
				)
			});
		}
		if (lang == 'ko') {
			this.allEvents.forEach(event=> {
				this.mapEventLanguage.set(
					event.id!,
					event.ko!
				)
			});
		}

	}

	handlePageChange(pageNumber: number) {
		this.page = pageNumber;

		const startIndex = (this.page - 1) * this.pageSize;
		const endIndex = startIndex + this.pageSize;

		this.eventsListDisplayed = this.eventsListFiltered.slice(startIndex, endIndex);
	}

	onSelectChange(value: string) {
		if (value == 'all') {
			this.eventsListFiltered = this.allEvents;
		} else if (value == 'future') {
			this.eventsListFiltered = this.allEvents.filter(event=> {
				return event.date_time?.toDate().getTime()! >= Date.now()
			});
		} else {
			this.eventsListFiltered = this.allEvents.filter(event=> {
				return event.date_time?.toDate().getTime()! < Date.now()
			});
		}

		this.sortingEventList();
	}

	private sortingEventList() {
		this.eventsListFiltered.sort((a, b) => {
			if (a.date_time?.toMillis()! < b.date_time?.toMillis()!) {
				return -1;
			}
			else if (a.date_time?.toMillis()! > b.date_time?.toMillis()!) {
				return 1;
			}
			else return 0;
		});

		this.eventsListDisplayed = this.eventsListFiltered;
		this.page = 1;
	}
}
