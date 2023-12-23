import {Component, OnInit} from '@angular/core';
import {LanguageService} from "../../shared/services/language/language.service";
import {AboutService} from "../../shared/services/page-info/about/about.service";
import {AboutPageData} from "../../shared/interfaces/about_page/about-page-data";
import {MemberService} from "../../shared/services/model/member/member.service";
import {Member} from "../../shared/models/member/member";
import {forkJoin, map, Observable, of} from "rxjs";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})

export class AboutComponent implements OnInit {

	isDataLoaded: boolean = false;

	pageInfo!: AboutPageData;
	mapLangPageInfo: Map<string, string> = new Map();
	langSelected: string = '';

  members: Observable<Member[] | null>;
  memberPhotos: Observable<string[] | null> = of(null);

  constructor(
	  private languageService: LanguageService,
	  private aboutService: AboutService,
	  private memberService: MemberService,
	  protected sanitizer: DomSanitizer
  ) {
    this.members = this.memberService.getAll().pipe(
      map(snapshot => (snapshot ? snapshot : null))
    );

    this.members.subscribe(members => {
      if (members !== null) {
        const photoObservables: Observable<string | null>[] = [];
        members.forEach((member: Member) => {
          const photoPath = member.photo;

          if (typeof photoPath === 'string') {
            photoObservables.push(
              this.memberService.getMemberPhoto(photoPath).pipe(
                map(photo => (typeof photo === 'string' ? photo : null))
              )
            );
          }
        });

        // Wait for all photo observables to complete using forkJoin
        if (photoObservables.length > 0) {
          this.memberPhotos = forkJoin(photoObservables).pipe(
            map(photos =>
              photos.filter(photo => photo !== null) as string[]
            ) // Filter out null values
          );
        } else {
          this.memberPhotos = of(null);
        }
      } else {
        this.memberPhotos = of(null);
      }
    });
  }

  ngOnInit(): void {
    this.aboutService.getAboutPageInfo().subscribe(snapshot => {
			if (snapshot.data()) {
				this.pageInfo = snapshot.data() as AboutPageData;

				this.languageService.language.subscribe(lang=> {
					this.langSelected = lang;
					this.populateLangMap(lang);

					this.isDataLoaded = true;
				});
			}
    });
  }

	private populateLangMap(lang: string) {
		switch (lang) {
			case 'en': {
				this.mapLangPageInfo.set(
					lang,
					this.pageInfo.en
				);
				break;
			}
			case 'it': {
				this.mapLangPageInfo.set(
					lang,
					this.pageInfo.it
				);
				break;
			}
			case 'ko': {
				this.mapLangPageInfo.set(
					lang,
					this.pageInfo.ko
				);
				break;
			}
		}
	}
}
