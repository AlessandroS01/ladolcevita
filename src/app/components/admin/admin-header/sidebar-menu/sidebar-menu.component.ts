import { Component } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";

@Component({
  selector: 'app-admin-header',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent {

  isMenuOpen: boolean = false;

  menuText = 'Menu';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url.startsWith('/admin/events')) {
        this.menuText = "Events";
      }
      else if (event.url.startsWith('/admin/articles')) {
        this.menuText = "Articles";
      }
      else if (event.url.startsWith('/admin/announcements')) {
        this.menuText = "Announcements";
      }
      else if (event.url.startsWith('/admin/members')) {
        this.menuText = "Members";
      }
      else if (event.url.startsWith('/admin/pages')) {
        this.menuText = "Pages";
      }
      else {
        this.menuText = "Menu";
      }

    });
  }

  toggleDropdownMenu(id: string) {
    const entryContainerElements = document.querySelectorAll('.entry-container');
    if (entryContainerElements !== null) {
      entryContainerElements.forEach(item => {
        if (item.classList.contains('invisible')) {
          item.classList.remove('invisible');
        } else {
          item.classList.add('invisible');
        }
      })
    }

    const subMenusContainers = document.querySelectorAll('.sub-menu');
    if (subMenusContainers !== null) {
      subMenusContainers.forEach(item => {
        if (item.id === id) {
          if (item.classList.contains('invisible')) {
            item.classList.remove('invisible');
          } else {
            item.classList.add('invisible');
          }
        }
      })
    }
  }

  moveVerticalMenu() {
    const menu = document.getElementById('menu');
    if (menu != null) {
      if (menu.classList.contains('hidden-menu')) {
        menu.classList.remove('hidden-menu');
        this.isMenuOpen = true;
      } else {
        menu.classList.add('hidden-menu');
        this.isMenuOpen = false;
      }
    }
  }

  changeTextMenu(newTitle: string) {
    this.menuText = newTitle;
    this.moveVerticalMenu();
  }
}
