import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {SwitchLangComponent} from "./switchlang/switch-lang.component";
import { LoginComponent } from './login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";



@NgModule({
    declarations: [
        NavbarComponent,
        SwitchLangComponent,
        LoginComponent
    ],
    exports: [
        CommonModule,
        NavbarComponent,
        LoginComponent,
        SwitchLangComponent
    ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        RouterLink,
        TranslateModule,
        ReactiveFormsModule,
        MatButtonModule,
    ]
})
export class HeaderModule { }
