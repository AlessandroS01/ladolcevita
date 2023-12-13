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
  eventList: Event[] = [];

  mapCoverPhoto: Map<string, string> = new Map<string, string>();

  page = 1;
  pageSize = 5;

  constructor(
    private eventService: EventService
  ) {
    this.eventService.getAll().subscribe(events => {
      this.allEvents = [];
      this.eventList = [];

      this.allEvents = events;
      this.allEvents.forEach(event => {
        this.eventService.getCoverPhotoEvent(event).subscribe(photo => {
          this.mapCoverPhoto.set(
            event.photo as string,
            photo
          );
        });
        if (event.date_time && event.date_time.toDate().getTime() > Date.now()) {
          this.eventList.push(event);
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
    this.eventList = this.allEvents.slice(startIndex, endIndex);
  };


  private sortingArray() {
    this.eventList.sort((a, b) => {
      if (a.date_time && b.date_time) {
        const dateA = a.date_time.seconds;
        const dateB = b.date_time.seconds;

        return dateA - dateB;
      }
      return 0;
    });
  }

  onSelectChange(value: string) {
    this.eventList = [];

    if (value == "1") {
      this.allEvents.forEach(event => {
        if (event.date_time && event.date_time.toDate().getTime() > Date.now()) {
          this.eventList.push(event);
        }
      })
      this.sortingArray();
    }
    else if (value == "2"){
      this.allEvents.forEach(event => {
        if (event.date_time && event.date_time.toDate().getTime() < Date.now()) {
          this.eventList.push(event);
        }
      })
      this.sortingArray();
    } else {
      this.allEvents.forEach(event => {
        this.eventList.push(event);
      })
      this.sortingArray();
    }

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
