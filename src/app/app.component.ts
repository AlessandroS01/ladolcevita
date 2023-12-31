import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  hideNavbarAndFooter: boolean = false;

	articlePageVisible: boolean = false;
	eventPageVisible: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.hideNavbarAndFooter = !event.url.startsWith('/admin');

			this.articlePageVisible = event.url.startsWith('/articles/article');
			this.eventPageVisible = event.url.startsWith('/events/event');
    });
  }
}
