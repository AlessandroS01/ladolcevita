import {Component, OnInit} from '@angular/core';

import { TranslateService } from "@ngx-translate/core";


import {faBars, faTimes} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  menuIcon = faBars;
  closeIcon = faTimes;

  isMenuOpen: boolean = false;

  toggleMenu() {
    if (window.screen.width <= 779) {

      this.isMenuOpen = !this.isMenuOpen;

      const menu = document.getElementById('menu');

      if (menu) {
        const computedStyle = window.getComputedStyle(menu);
        const leftValue = computedStyle.getPropertyValue('left');

        if (leftValue == '0px') {
          menu.style.left = '-100%';
        }

        if (leftValue != '0px') {
          menu.style.left = '0%';
        }
      }
    }
  }

  ngOnInit(): void {

  }
}
