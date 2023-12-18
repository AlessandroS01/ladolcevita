import { NgModule } from '@angular/core';
import { ArticlesComponent } from './articles.component';
import {CommonModule} from "@angular/common";
import {NgxPaginationModule} from "ngx-pagination";
import {TranslateModule} from "@ngx-translate/core";
import { ArticleComponent } from './article/article.component';
import {RouterLink} from "@angular/router";



@NgModule({
  declarations: [
    ArticlesComponent,
    ArticleComponent
  ],
	imports: [
		CommonModule,
		NgxPaginationModule,
		TranslateModule,
		RouterLink
	]
})
export class ArticlesModule { }
