import {Component, Input, OnInit,} from '@angular/core';
import {AboutService} from "../../../shared/services/page-info/about/about.service";

@Component({
  selector: 'about-slideshow',
  templateUrl: './about-slideshow.component.html',
  styleUrls: ['./about-slideshow.component.css']
})
export class AboutSlideshowComponent implements OnInit {

  slides: { id: number, src: string }[] = [];

  constructor(private aboutService: AboutService) {

    /*this.aboutService.getFilesFromFolder("slider").subscribe(downloadUrls => {
      console.log(downloadUrls)
      this.slides = downloadUrls.map((url: string, index: number) => {
          return {
            id: index,
            src: url
          }
        }
      );
    });

     */
  }

  ngOnInit(): void {

  }
}
