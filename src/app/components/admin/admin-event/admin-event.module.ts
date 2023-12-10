import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsViewComponent } from './view/events-view.component';
import { EventsCreateComponent } from './create/events-create.component';
import {AngularEditorModule} from "@kolkov/angular-editor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import { EventsModifyComponent } from './modify/events-modify.component';
import {RouterLink} from "@angular/router";




@NgModule({
  declarations: [
    EventsViewComponent,
    EventsCreateComponent,
    EventsModifyComponent
  ],
    imports: [
        CommonModule,
        AngularEditorModule,
        ReactiveFormsModule,
        FormsModule,
        NgxPaginationModule,
        RouterLink
    ],
  providers: [

  ]
})
export class AdminEventModule { }
