import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'switchlang',
  templateUrl: './switchlang.component.html',
  styleUrls: ['./switchlang.component.css']
})
export class SwitchlangComponent implements OnInit{

  ngOnInit() {
    let langTag = document.getElementById('en');

    if (langTag) {
      langTag.classList.add("active");
    }
  }

  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'it', 'ko']);
    translate.setDefaultLang('en');
  }

  switchLang(lang: string) {
    this.translate.use(lang);

    let prevLangTag = document.getElementsByClassName('active').item(0);

    if (prevLangTag) {
      prevLangTag.classList.remove("active");
    }

    let newLangTag = document.getElementById(lang);
    if (newLangTag) {
      newLangTag.classList.add("active");
    }

    //document.getElementsByClassName('lang ' + lang).item(0)!.classList.add("active");
  }

}
