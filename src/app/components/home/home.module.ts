import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeSlideshowComponent } from './home-slideshow/home-slideshow.component';
import {
  CarouselComponent,
  CarouselControlComponent, CarouselIndicatorsComponent,
  CarouselInnerComponent,
  CarouselItemComponent
} from "@coreui/angular";
import {RouterLink} from "@angular/router";



@NgModule({
  declarations: [
    HomeComponent,
    HomeSlideshowComponent
  ],
  imports: [
    CommonModule,
    CarouselComponent,
    CarouselInnerComponent,
    CarouselItemComponent,
    CarouselControlComponent,
    RouterLink,
    CarouselIndicatorsComponent
  ]
})
export class HomeModule { }
