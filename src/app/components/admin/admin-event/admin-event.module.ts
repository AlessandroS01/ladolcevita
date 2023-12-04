import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsViewComponent } from './view/events-view.component';
import { EventsCreateComponent } from './create/events-create.component';
import {provideQuillConfig, QuillModule} from "ngx-quill";




@NgModule({
  declarations: [
    EventsViewComponent,
    EventsCreateComponent
  ],
  imports: [
    CommonModule,
    QuillModule.forRoot()
  ],
  providers: [
    provideQuillConfig({
      modules: {
        syntax: true,
      }
    })
  ]
})
export class AdminEventModule { }
