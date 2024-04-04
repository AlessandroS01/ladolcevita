import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersCreateComponent } from './create/members-create.component';
import { MembersViewComponent } from './view/members-view.component';
import {TranslateModule} from "@ngx-translate/core";
import { MembersModifyComponent } from './modify/members-modify.component';
import {RouterLink} from "@angular/router";
import {AngularEditorModule} from "@kolkov/angular-editor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    MembersCreateComponent,
    MembersViewComponent,
    MembersModifyComponent
  ],
	imports: [
		CommonModule,
		TranslateModule,
		RouterLink,
		AngularEditorModule,
		FormsModule,
		ReactiveFormsModule
	]
})
export class AdminMembersModule { }
