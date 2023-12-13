import { NgModule } from '@angular/core';
import { ArticlesComponent } from './articles.component';
import {CommonModule} from "@angular/common";
import {NgxPaginationModule} from "ngx-pagination";
import {TranslateModule} from "@ngx-translate/core";



@NgModule({
  declarations: [
    ArticlesComponent
  ],
	imports: [
		CommonModule,
		NgxPaginationModule,
		TranslateModule
	]
})
export class ArticlesModule { }
