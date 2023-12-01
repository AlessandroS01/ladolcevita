import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import {RouterLink} from "@angular/router";



@NgModule({
    declarations: [
        SidebarMenuComponent
    ],
    exports: [
        SidebarMenuComponent
    ],
    imports: [
        CommonModule,
        RouterLink
    ]
})
export class AdminHeaderModule { }
