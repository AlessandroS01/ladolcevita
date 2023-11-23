import {Component, OnInit} from '@angular/core';
import {LanguageService} from "../../shared/services/language/language.service";
import {AboutService} from "../../shared/services/page-info/about/about.service";
import {AboutPageData} from "../../shared/interfaces/about_page/about-page-data";
import {MemberService} from "../../shared/services/model/member/member.service";
import {Member} from "../../shared/models/member/member";
import {forkJoin, map, Observable, of} from "rxjs";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})

export class AboutComponent implements OnInit {

  title: string = '';
  titleDescription: string = '';

  subtitles: {
    value: string,
    description: string
  }[] = [];

  members: Observable<Member[] | null>;
  memberPhotos: Observable<string[] | null> = of(null);

  constructor(
    private languageService: LanguageService,
    private aboutService: AboutService,
    private memberService: MemberService
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
    this.languageService.language.subscribe((language: string) => {
      this.clearPageInfo();
      if (language != null) {
        this.aboutService.getAboutPageInfo(language).subscribe(snapshot => {
          const data = snapshot.data() as AboutPageData;

          if (data !== undefined && data !== null) {

            this.title = data.title;
            this.titleDescription = data.title_description;

            this.subtitles = data.subtitles;

          }
        });
      }
    });

    /*
    this.aboutService.getFilesFromFolder("cover").subscribe(downloadUrls => {
      this.coverImageURL = downloadUrls.filter(url =>
        url.includes('.jpg') || url.includes('.png')
      ).at(0);
    });
     */
  }

  clearPageInfo() {
    this.title = '';
    this.titleDescription = '';
    this.subtitles = [];
  }
}