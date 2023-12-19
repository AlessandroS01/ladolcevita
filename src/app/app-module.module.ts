import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from "@angular/common/http";


import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {NotFoundComponent} from "./components/error-pages/not-found/not-found.component";
import {HeaderModule} from "./components/header/header.module";
import {HomeModule} from "./components/home/home.module";
import {FooterModule} from "./components/footer/footer.module";
import {PopupsModule} from "./components/popups/popups.module";
import {CarouselModule} from "ngx-bootstrap/carousel";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {
  CarouselCaptionComponent,
  CarouselComponent, CarouselControlComponent,
  CarouselIndicatorsComponent,
  CarouselInnerComponent,
  CarouselItemComponent
} from "@coreui/angular";
import {NgOptimizedImage} from "@angular/common";
import {AboutModule} from "./components/about/about.module";
import { UnauthorizedComponent } from './components/error-pages/unauthorized/unauthorized.component';
import {AdminHeaderModule} from "./components/admin/admin-header/admin-header.module";
import {AdminComponent} from "./components/admin/admin/admin.component";
import {NgxPaginationModule} from "ngx-pagination";
import {AdminEventModule} from "./components/admin/admin-event/admin-event.module";
import { PhotoComponent } from './components/admin/photo/photo/photo.component';
import {AngularEditorModule} from "@kolkov/angular-editor";
import {AdminArticleModule} from "./components/admin/admin-article/admin-article.module";
import {ArticlesModule} from "./components/articles/articles.module";
import {AdminHomeModule} from "./components/admin/admin-home/admin-home.module";
import { NewPhotoComponent } from './components/admin/admin-home/new-photo/new-photo.component';





@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    UnauthorizedComponent,
    AdminComponent,
    PhotoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,

    MatDialogModule,
    BrowserAnimationsModule,
    CarouselModule,
    NgxPaginationModule,

    HeaderModule,
    HomeModule,
    AboutModule,
	  ArticlesModule,
    FooterModule,
    PopupsModule,
    AdminEventModule,
    AdminArticleModule,
	  AdminHomeModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireAuthModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    CarouselIndicatorsComponent,
    CarouselComponent,
    CarouselInnerComponent,
    CarouselItemComponent,
    CarouselCaptionComponent,
    CarouselControlComponent,
    NgOptimizedImage,
    AdminHeaderModule,
    AngularEditorModule
  ],
  providers: [],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
