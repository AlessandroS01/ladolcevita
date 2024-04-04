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

  members: Member[] = [];
  mapMemberPhotos: Map<string, string> = new Map<string, string>();

  constructor(
	  private languageService: LanguageService,
	  private aboutService: AboutService,
	  private memberService: MemberService,
	  protected sanitizer: DomSanitizer
  ) {
    this.memberService.getAll().subscribe(members=> {

			this.members = members.sort(
				(a: Member, b: Member) =>
					(a.level ?? 0) - (b.level ?? 0)
			);

	    const photoObservables = members.map(member =>
		    this.memberService.getMemberPhoto(member.photo as string)
	    );

	    forkJoin(photoObservables).subscribe(photos => {
		    photos.forEach((photo, index) => {
			    this.mapMemberPhotos.set(
				    members[index].email as string,
				    photo
			    );
		    });

				this.isDataLoaded = true;
	    });

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
