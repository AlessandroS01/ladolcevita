import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutAdminComponent } from './about/about-admin.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AngularEditorModule} from "@kolkov/angular-editor";



@NgModule({
  declarations: [
    AboutAdminComponent
  ],
	imports: [
		CommonModule,
		FormsModule,
		AngularEditorModule,
		ReactiveFormsModule
	]
})
export class AdminAboutModule { }
