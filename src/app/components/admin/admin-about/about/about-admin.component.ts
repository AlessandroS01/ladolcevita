import { Component } from '@angular/core';
import {AboutService} from "../../../../shared/services/page-info/about/about.service";
import {AboutPageData} from "../../../../shared/interfaces/about_page/about-page-data";
import {HomePageData} from "../../../../shared/interfaces/home_page/home-page-data";
import {editorConfig} from "../../../../shared/global/variables/global";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {LoadingPopupComponent} from "../../../popups/loading-popup/loading-popup.component";

@Component({
  selector: 'app-about',
  templateUrl: './about-admin.component.html',
  styleUrls: [
		'./about-admin.component.css',
	  '../../../../shared/global/css/text-editor.css'
  ]
})
export class AboutAdminComponent {

	isDataLoaded: boolean = false;

	selectedLanguage= 'english';

	htmlContentEn = '';
	htmlContentIt = '';
	htmlContentKo = '';


	constructor(
		private aboutService: AboutService,
		private router: Router,
		private dialog: MatDialog
	) {
		this.aboutService.getAboutPageInfo().subscribe(info=> {
			if (info.data()) {
				const data = info.data() as AboutPageData;

				this.htmlContentEn = data.en;
				this.htmlContentIt = data.it;
				this.htmlContentKo = data.ko;

				this.isDataLoaded = true;
			}
		})
	}

	protected readonly editorConfig = editorConfig;

	changeSelectedTextEditor(language: string) {
		switch (language) {
			case 'english' : {
				this.changeAppearanceButton('english-button');
				this.selectedLanguage = 'english';
				break;
			}
			case 'italian': {
				this.changeAppearanceButton('italian-button');
				this.selectedLanguage = 'italian';
				break;
			}
			case 'korean': {
				this.changeAppearanceButton('korean-button');
				this.selectedLanguage = 'korean';
				break;
			}
		}
	}

	changeAppearanceButton(id: string) {
		const parentDiv = document.getElementById('buttons-container');
		if (parentDiv) {
			const buttons = parentDiv.querySelectorAll<HTMLElement>('button');
			if (buttons) {
				buttons.forEach(button => {
					if (button.id == id) {
						if (!button.classList.contains('selected')) {
							button.classList.add('selected');
						}
					} else {
						if (button.classList.contains('selected')) {
							button.classList.remove('selected');
						}
					}
				})
			}
		}
	}

	submitForm() {
		if (
			this.htmlContentEn != '' &&
			this.htmlContentIt != '' &&
			this.htmlContentKo != ''
		){
			const pageInfo: AboutPageData = {
				en: this.htmlContentEn,
				it: this.htmlContentIt,
				ko: this.htmlContentKo
			}

			this.aboutService.changePageInfo(pageInfo).then( _ => {
				const dialogRef = this.dialog.open(LoadingPopupComponent, {
					width: '1000px',
					height: '350px',
					maxHeight: '350px',
					disableClose: true,
					data: {
						uploadPercentage: 100,
						message: 'About page modified successfully',
						create: {
							title: 'Modify again',
							value: 'new-update'
						},
						view: {
							title: '',
							value: ''
						},
						main: {
							title: 'Main page',
							value: 'main-page'
						}
					} // Initial value, it will be updated
				});

				dialogRef.afterClosed().subscribe(message =>{
					if (message == 'new-update') {
						window.location.reload();
					}
					if (message == 'main-page') {
						this.router.navigate(['admin']);
					}
				});

			});
		} else {
			window.alert('Some content is not given')
		}
	}
}
