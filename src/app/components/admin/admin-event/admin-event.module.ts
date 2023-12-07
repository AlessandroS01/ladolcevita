import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsViewComponent } from './view/events-view.component';
import { EventsCreateComponent } from './create/events-create.component';
import {AngularEditorModule} from "@kolkov/angular-editor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";




@NgModule({
  declarations: [
    EventsViewComponent,
    EventsCreateComponent
  ],
    imports: [
        CommonModule,
        AngularEditorModule,
        ReactiveFormsModule,
        FormsModule,
        NgxPaginationModule
    ],
  providers: [

  ]
})
export class AdminEventModule { }
