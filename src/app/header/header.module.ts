import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {SwitchLangComponent} from "./switchlang/switch-lang.component";
import { LoginComponent } from './login/login.component';



@NgModule({
    declarations: [
        NavbarComponent,
        SwitchLangComponent,
        LoginComponent
    ],
    exports: [
        NavbarComponent,
        SwitchLangComponent
    ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterLink,
    TranslateModule,
  ]
})
export class HeaderModule { }
