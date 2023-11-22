import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {LanguageService} from "../../shared/services/language/language.service";
import {AboutService} from "../../shared/services/page-info/about/about.service";
import {AboutPageData} from "../../shared/interfaces/about_page/about-page-data";

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

  constructor(
    private languageService: LanguageService,
    private aboutService: AboutService
  ) {
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
