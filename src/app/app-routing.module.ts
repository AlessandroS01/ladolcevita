import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {NotFoundComponent} from "./components/error-pages/not-found/not-found.component";
import {AboutComponent} from "./components/about/about.component";
import {AdminComponent} from "./components/admin/admin/admin.component";
import {adminGuard} from "./guards/admin/admin.guard";
import {UnauthorizedComponent} from "./components/error-pages/unauthorized/unauthorized.component";
import {EventsViewComponent} from "./components/admin/admin-event/view/events-view.component";
import {EventsCreateComponent} from "./components/admin/admin-event/create/events-create.component";

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'about', component: AboutComponent},
  { path: 'admin', canActivate:[adminGuard], component: AdminComponent},
  { path: 'admin/events/view', canActivate:[adminGuard], component: EventsViewComponent},
  { path: 'admin/events/create', canActivate:[adminGuard], component: EventsCreateComponent},

  { path: 'unauthorized', component: UnauthorizedComponent},
  { path: '**', component: NotFoundComponent}, // leave this at the end
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
