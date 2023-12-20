import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { EventComponent } from './event/event.component';
import {NgxPaginationModule} from "ngx-pagination";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    EventsComponent,
    EventComponent
  ],
	imports: [
		CommonModule,
		NgxPaginationModule,
		TranslateModule,
		RouterLink,
		ReactiveFormsModule,
	]
})
export class EventsModule { }
