import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HomeService} from "../../../shared/services/page-info/home/home.service";
import {LanguageService} from "../../../shared/services/language/language.service";
import {HomePageData} from "../../../shared/interfaces/home_page/home-page-data";

const animation = { duration: 25000, easing: (t: any) => t }

@Component({
  selector: 'home-slideshow',
  templateUrl: './home-slideshow.component.html',
  styleUrls: ['./home-slideshow.component.css']
})
export class HomeSlideshowComponent {
	images: String[] = [];
	homeData!: HomePageData;

	description: string = '';

	constructor(
		private homeService: HomeService,
		private languageService: LanguageService
	) {
		this.homeService.getSliderImages().subscribe(photos => {
			this.homeService.getHomePageInfo().subscribe(info=> {
				if (info.data()) {
					this.homeData = info.data() as HomePageData;
					this.languageService.language.subscribe(lang=> {
						if (lang == 'en') {
							this.description = this.homeData.en.sliderDescription;
						}
						if (lang == 'it') {
							this.description = this.homeData.it.sliderDescription;
						}
						if (lang == 'ko') {
							this.description = this.homeData.ko.sliderDescription;
						}
					})
				}
			})

			this.images = photos;
		});
	}
}
