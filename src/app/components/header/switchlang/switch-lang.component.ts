import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../shared/services/language/language.service";

@Component({
  selector: 'switchlang',
  templateUrl: './switch-lang.component.html',
  styleUrls: ['./switch-lang.component.css']
})
export class SwitchLangComponent implements OnInit{

  langSelected: string = "en";

  ngOnInit() {
		this.languageService.language.subscribe(lang=> {
			this.langSelected = lang;

			this.changeDisplayCss(this.langSelected);
		})
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

		this.langSelected = lang;

		this.changeDisplayCss(lang);
		this.languageService.setLanguage(lang);
  }

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
