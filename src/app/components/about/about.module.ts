import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AboutComponent} from "./about.component";
import {TranslateModule} from "@ngx-translate/core";



@NgModule({
  declarations: [
    AboutComponent
  ],
  imports: [
    CommonModule,
    TranslateModule
  ]
})
export class AboutModule { }
