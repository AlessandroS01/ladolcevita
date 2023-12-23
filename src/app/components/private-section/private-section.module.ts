import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsComponent } from './tickets/tickets.component';
import {FormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {TranslateModule} from "@ngx-translate/core";



@NgModule({
  declarations: [
    TicketsComponent
  ],
	imports: [
		CommonModule,
		FormsModule,
		NgxPaginationModule,
		TranslateModule
	]
})
export class PrivateSectionModule { }
