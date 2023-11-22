import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../shared/services/language/language.service";

@Component({
  selector: 'switchlang',
  templateUrl: './switch-lang.component.html',
  styleUrls: ['./switch-lang.component.css']
})
export class SwitchLangComponent implements OnInit{

  isDivHidden: boolean = true;
  langSelected: string = "English";
  flagLangSelected: string = "assets/img/languages/united-kingdom.png";

  ngOnInit() {
    let langTag = document.getElementById('en');

    if (langTag) {
      langTag.classList.add("active");
    }
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
      this.langSelected = "English"
      this.flagLangSelected = "assets/img/languages/united-kingdom.png";
      this.languageService.setLanguage("en");
    }
    if (lang == "it") {
      this.langSelected = "Italiano"
      this.flagLangSelected = "assets/img/languages/italian.png";
      this.languageService.setLanguage("it");
    }
    if (lang == "ko") {
      this.langSelected = "한국어"
      this.flagLangSelected = "assets/img/languages/south-korea.png";
      this.languageService.setLanguage("ko");
    }

    this.isDivHidden = true;
  }

  toggleDiv() {
    this.isDivHidden = !this.isDivHidden;
  }
}
