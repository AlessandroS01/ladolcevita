import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../shared/services/language/language.service";

@Component({
  selector: 'switchlang',
  templateUrl: './switch-lang.component.html',
  styleUrls: ['./switch-lang.component.css']
})
export class SwitchLangComponent implements OnInit{

  // isDivHidden: boolean = true;
  // langSelected: string = "English";
  // flagLangSelected: string = "assets/img/languages/united-kingdom.png";

  ngOnInit() {
    this.changeDisplayCss('english-language');
  }

  constructor(
    public translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'it', 'ko']);
    translate.setDefaultLang('en');
  }

  switchLang(lang: string) {
    this.translate.use(lang);

    if (lang == "en") {
      // this.langSelected = "English"
      // this.flagLangSelected = "assets/img/languages/united-kingdom.png";
      this.changeDisplayCss('english-language');

      this.languageService.setLanguage("en");
    }
    if (lang == "it") {
      // this.langSelected = "Italiano"
      // this.flagLangSelected = "assets/img/languages/italian.png";
      this.changeDisplayCss('italian-language');
      this.languageService.setLanguage("it");
    }
    if (lang == "ko") {
      // this.langSelected = "한국어"
      // this.flagLangSelected = "assets/img/languages/south-korea.png";
      this.changeDisplayCss('korean-language');
      this.languageService.setLanguage("ko");
    }

    //this.isDivHidden = true;
  }

  /*
  toggleDiv() {
    this.isDivHidden = !this.isDivHidden;
  }
   */

  changeDisplayCss(id: string) {
    const element = document.getElementById(id);
    if (element != null) {
      element.classList.add('active');
      this.removeDisplayCss(id);
    }
  }

  removeDisplayCss(id: string) {
    const allPElements = document.getElementsByTagName('p');

    if (allPElements != null) {
      for (let i = 0; i < allPElements.length; i++) {
        const currentElement = allPElements[i];

        if (currentElement.id !== id) {
          // Remove the 'active' class from elements that were not clicked
          currentElement.classList.remove('active');
        }
      }
    }
  }
}
