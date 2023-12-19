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
import {EventsModifyComponent} from "./components/admin/admin-event/modify/events-modify.component";
import {ArticlesViewComponent} from "./components/admin/admin-article/view/view-articles.component";
import {ArticlesCreateComponent} from "./components/admin/admin-article/create/articles-create.component";
import {ArticlesModifyComponent} from "./components/admin/admin-article/modify/articles-modify.component";
import {ArticlesComponent} from "./components/articles/articles.component";
import {ArticleComponent} from "./components/articles/article/article.component";
import {HomeAdminComponent} from "./components/admin/admin-home/home/home-admin.component";

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'about', component: AboutComponent},
  { path: 'articles', component: ArticlesComponent},
  { path: 'articles/article/:id', component: ArticleComponent},
  { path: 'admin', canActivate:[adminGuard], component: AdminComponent},
  { path: 'admin/home', canActivate:[adminGuard], component: HomeAdminComponent},
  { path: 'admin/events/view', canActivate:[adminGuard], component: EventsViewComponent},
  { path: 'admin/events/create', canActivate:[adminGuard], component: EventsCreateComponent},
  { path: 'admin/events/modify/:id', canActivate:[adminGuard], component: EventsModifyComponent},
  { path: 'admin/articles/view', canActivate:[adminGuard], component: ArticlesViewComponent},
  { path: 'admin/articles/create', canActivate:[adminGuard], component: ArticlesCreateComponent},
  { path: 'admin/articles/modify/:id', canActivate:[adminGuard], component: ArticlesModifyComponent},

  { path: 'unauthorized', component: UnauthorizedComponent},
  { path: '**', component: NotFoundComponent}, // leave this at the end
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
