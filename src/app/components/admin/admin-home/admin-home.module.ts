import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeAdminComponent } from './home/home-admin.component';
import {ReactiveFormsModule} from "@angular/forms";
import {NewPhotoComponent} from "./new-photo/new-photo.component";



@NgModule({
  declarations: [
    HomeAdminComponent,
	  NewPhotoComponent
  ],
	imports: [
		CommonModule,
		ReactiveFormsModule
	]
})
export class AdminHomeModule { }
