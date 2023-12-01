import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent {

  isMenuOpen: boolean = false;

  menuText = 'Menu';

  constructor() {

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
  }
}
