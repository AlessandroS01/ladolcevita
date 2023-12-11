import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ArticlesViewComponent} from "./view/view-articles.component";
import {ArticlesCreateComponent} from "./create/articles-create.component";
import {ArticlesModifyComponent} from "./modify/articles-modify.component";
import {AngularEditorModule} from "@kolkov/angular-editor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    ArticlesViewComponent,
    ArticlesCreateComponent,
    ArticlesModifyComponent
  ],
  imports: [
    CommonModule,
    AngularEditorModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminArticleModule { }
