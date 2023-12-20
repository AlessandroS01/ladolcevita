import { Component } from '@angular/core';
import {EventService} from "../../../../shared/services/model/event/event.service";
import {Event} from "../../../../shared/models/event/event";

@Component({
  selector: 'app-view',
  templateUrl: './events-view.component.html',
  styleUrls: [
    './events-view.component.css',
    '../../../../shared/global/css/admin-table-pages.css'
  ]
})
export class EventsViewComponent {

  isDataLoaded: boolean = false;
  allEvents: Event[] = [];
  eventListFiltered: Event[] = [];
  eventListDisplayed: Event[] = [];

  mapCoverPhoto: Map<string, string> = new Map<string, string>();

  page = 1;
  pageSize = 4;

  constructor(
    private eventService: EventService
  ) {
    this.eventService.getAll().subscribe(events => {
      this.allEvents = [];
      this.eventListFiltered = [];

      this.allEvents = events;
      this.allEvents.forEach(event => {
        this.eventService.getCoverPhotoEvent(event).subscribe(photo => {
          this.mapCoverPhoto.set(
            event.photo as string,
            photo
          );
        });
        if (event.date_time && event.date_time.toDate().getTime() > Date.now()) {
          this.eventListFiltered.push(event);
        }
      });

      this.sortingArray();
      this.isDataLoaded = true;
    });
  }

  handlePageChange(pageNumber: number) {
    this.page = pageNumber;

    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.eventListDisplayed = this.eventListFiltered.slice(startIndex, endIndex);
  };


  private sortingArray() {
	  this.eventListFiltered.sort((a, b) => {
		  if (a.date_time?.toMillis()! < b.date_time?.toMillis()!) {
			  return -1;
		  }
		  else if (a.date_time?.toMillis()! > b.date_time?.toMillis()!) {
			  return 1;
		  }
		  else return 0;
	  });

	  this.eventListDisplayed = this.eventListFiltered;
	  this.page = 1;
  }

  onSelectChange(value: string) {
    if (value == "1") {
	    this.eventListFiltered = this.allEvents.filter(event=> {
		    return event.date_time?.toDate().getTime()! >= Date.now()
	    });
    }
    else if (value == "2"){
	    this.eventListFiltered = this.allEvents.filter(event=> {
		    return event.date_time?.toDate().getTime()! < Date.now()
	    });
    } else {
      this.eventListFiltered = this.allEvents;
    }

	  this.sortingArray();
  }

  deleteEvent(event: Event) {
    if (confirm("Are you sure you want to delete the selected event?")) {
      this.eventService.deleteFolder(event.id as string);
      return;
    } else {
      return;
    }
  }
}
