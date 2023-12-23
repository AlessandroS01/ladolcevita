import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Event} from "../../../shared/models/event/event";
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleService} from "../../../shared/services/model/article/article.service";
import {MemberService} from "../../../shared/services/model/member/member.service";
import {LanguageService} from "../../../shared/services/language/language.service";
import {EventService} from "../../../shared/services/model/event/event.service";
import {Details, Subparagraph} from "../../../shared/models/common/details-subparagraphs";
import {Article} from "../../../shared/models/article/article";
import {ParticipantService} from "../../../shared/services/model/participant/participant.service";
import {AuthService} from "../../../shared/services/auth/auth.service";
import {User} from "../../../shared/models/user/user.model";
import {MatDialog} from "@angular/material/dialog";
import {LoginPopupComponent} from "../../popups/login-popup/login-popup.component";
import {SignupPopupComponent} from "../../popups/signup-popup/signup-popup.component";
import {Subscription} from "rxjs";
import * as events from "events";
import {user} from "@angular/fire/auth";
import {Participant} from "../../../shared/models/participant/participant";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: [
		'./event.component.css',
	  './../../../shared/global/css/article-event.css'
  ]
})
export class EventComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];

	ticketOwnedString: string = '';
	claimTicketString: string = '';
	logInString: string = '';
	eventExpiredString: string = '';

	eventExpired: boolean = false;

	loggedUser: User | null = null;
	hasTicket: boolean = false;

	isDataLoaded: boolean = false;
	event: Event = {};
	mapEventLang: Map<string, Details> = new Map();

	allEvents: Event[] = [];
	relatedEvents: Event[] = [];
	relatedEventsTitle: string = '';

	mapPhotoUrl: Map<string, string> = new Map();
	language: string = '';

	ngOnInit(): void {
		const paramsSub = this.route.params.subscribe(params => {
			if (params) {
				const eventId = params['id'];

				const eventsSub = this.eventService.getAll().subscribe(events => {

					events.forEach(event => {
						if (event.id == eventId) {
							this.event = event;
							this.eventExpired = event.date_time?.toDate().getTime()! < Date.now();
						} else if (event.date_time?.toDate().getTime()! > Date.now()) {
							if (!this.allEvents.find(allEvents=> {return allEvents.id == event.id})) {
								this.allEvents.push(event);
								this.sortAllEventsByDate();
							}
						}
					});
					this.relatedEvents = this.allEvents.slice(0, 5);

					const loggedUserSub = this.authService.getLoggedUser().subscribe(user => {
						if (user != null) {
							this.loggedUser = user;

							this.participationService.getAll().subscribe(participants=> {
								this.hasTicket = participants.filter(item=> {
									return item.event == eventId && item.email == user.email
								}).length != 0;
							})

						} else {
							this.loggedUser = null;
						}

						const langSub = this.languageService.language.subscribe(lang => {
							this.populateLanguageMap(lang, this.event);
							this.changeButtonStrings(lang);

							const coverPhotoSub = this.eventService.getCoverPhotoEvent(this.event).subscribe(cover => {
								this.mapPhotoUrl.set('cover', cover);
							});

							this.subscriptions.push(coverPhotoSub);
							this.initializeSubWithLang(lang, this.event);
						});

						this.subscriptions.push(langSub);
						this.isDataLoaded = true;
					});

					this.subscriptions.push(loggedUserSub, eventsSub);
				});

				this.subscriptions.push(eventsSub);
			}
		});

		this.subscriptions.push(paramsSub);
	}




	ngOnDestroy(): void {
		this.subscriptions.forEach(sub=> sub.unsubscribe());
	}

	constructor(
		protected sanitizer: DomSanitizer,
		private route: ActivatedRoute,
		private router: Router,
		private eventService: EventService,
		private languageService: LanguageService,
		private participationService: ParticipantService,
		private authService: AuthService,
		private dialog: MatDialog
	) {
	}



	private sortAllEventsByDate() {
		this.allEvents.sort((a, b) => {
			if (a.date_time?.toMillis()! < b.date_time?.toMillis()!) {
				return -1;
			}
			else if (a.date_time?.toMillis()! > b.date_time?.toMillis()!) {
				return 1;
			}
			else return 0;
		})
	}

	private populateLanguageMap(lang: string, event: Event) {
		switch (lang) {
			case 'en': {
				this.mapEventLang.set(
					event.id!,
					event.en!
				);
				this.language = 'English';
				break;
			}
			case 'it': {
				this.mapEventLang.set(
					event.id!,
					event.it!
				);
				this.language = 'Italiano';
				break;
			}
			case 'ko': {
				this.mapEventLang.set(
					event.id!,
					event.ko!
				);
				this.language = '한국인';
				break;
			}
		}
	}

	initializeSubWithLang(lang: string, event: Event) {
		switch (lang) {
			case 'en': {
				this.relatedEventsTitle = 'Upcoming events';
				this.populateMapPhoto(
					event.en?.subparagraphs!,
					event.id!
				);
				break;
			}
			case 'it': {
				this.relatedEventsTitle = 'Prossimi events';
				this.populateMapPhoto(
					event.it?.subparagraphs!,
					event.id!
				);
				break;
			}
			case 'ko': {
				this.relatedEventsTitle = '다가오는 이벤트';
				this.populateMapPhoto(
					event.ko?.subparagraphs!,
					event.id!
				);
				break;
			}
		}
	}

	populateMapPhoto(subparagraphs: Subparagraph[], eventId: string) {
		subparagraphs.forEach(sub=> {
			if (sub.photo) {
				this.eventService.getPhotoEvent(sub.photo, eventId).subscribe(photo=> {
					this.mapPhotoUrl.set(
						sub.photo!,
						photo
					)
				})
			}
		})
	}

	changeLangEvent(lang: string) {
		this.populateLanguageMap(lang, this.event);
		this.initializeSubWithLang(lang, this.event);
		this.changeButtonStrings(lang);
	}

	reloadCurrentRoute(eventId: string) {
		this.router.navigateByUrl('events/event/' + eventId, { skipLocationChange: true }).then(() => {
		});

		this.clearEventData();
	}

	clearEventData() {
		this.isDataLoaded = false;
		this.event = {};
		this.allEvents = [];
		this.relatedEventsTitle = '';
		this.relatedEvents = [];
		this.mapEventLang = new Map();
		this.mapPhotoUrl = new Map();
		this.loggedUser = null;
		this.hasTicket = false;
	}

	openLogin() {
		const popup = this.dialog.open(LoginPopupComponent, {
			enterAnimationDuration: '0.2s',
			exitAnimationDuration: '0.2s'
		});

		popup.afterClosed().subscribe( message => {
			if (message == 'register') {
				this.openSignUp()
			}
			if (message == 'login successful') {
				this.reloadCurrentRoute(this.event.id!);
			}
		});
	}

	openSignUp() {
		const popup = this.dialog.open(SignupPopupComponent, {
			height: '80%',
			enterAnimationDuration: '0.2s',
			exitAnimationDuration: '0.2s'
		});

		popup.afterClosed().subscribe( message => {
			if (message == 'login') {
				this.openLogin()
			}
			if (message == 'signup successful') {
				this.reloadCurrentRoute(this.event.id!);
			}
		});
	}

	protected readonly User = User;
	protected readonly Date = Date;

	private changeButtonStrings(lang: string) {
		switch (lang) {
			case 'en': {
				this.ticketOwnedString = "Ticket already owned";
				this.claimTicketString = "Claim your ticket";
				this.logInString = "Log in first";
				this.eventExpiredString = "Event already expired";
				break;
			}
			case 'it': {
				this.ticketOwnedString = "Biglietto già posseduto";
				this.claimTicketString = "Richiedi il biglietto";
				this.logInString = "Effettua il login prima";
				this.eventExpiredString = "Evento già scaduto";
				break;
			}
			case 'ko': {
				this.ticketOwnedString = "이미 소유한 티켓입니다";
				this.claimTicketString = "티켓 요청하기";
				this.logInString = "먼저 로그인하세요";
				this.eventExpiredString = "이벤트가 이미 종료되었습니다";
				break;
			}
		}
	}

	addNewParticipant() {
		const newPart = new Participant();
		newPart.event = this.event.id!;
		newPart.email = this.loggedUser?.email;

		this.participationService.create(newPart).subscribe(_ => {
			window.alert('Ticket claimed successfully')
		});
	}
}
