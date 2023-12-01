import { Component } from '@angular/core';
import {HomeService} from "../../../shared/services/page-info/home/home.service";

@Component({
  selector: 'home-slideshow',
  templateUrl: './home-slideshow.component.html',
  styleUrls: ['./home-slideshow.component.css']
})
export class HomeSlideshowComponent {
  sliderImages: {
    id: number,
    src: string
  }[] = [];

  constructor(
    private homeService : HomeService
  ) {

  }

  ngOnInit(): void {

    this.homeService.getSliderImages().subscribe(downloadUrls => {
      this.sliderImages = downloadUrls.filter(url =>
        url.includes('.jpg') || url.includes('.png')
      ).map((item: string, index: number) => {
        return {
          id: index,
          src: item
        }
      });

      console.log(this.sliderImages)
    });

  }

}
