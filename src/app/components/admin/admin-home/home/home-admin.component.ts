import {Component, ComponentRef, signal, ViewChild, ViewContainerRef} from '@angular/core';
import {HomeService} from "../../../../shared/services/page-info/home/home.service";
import {HomePageData, HomePageLangData} from "../../../../shared/interfaces/home_page/home-page-data";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PhotoComponent} from "../../photo/photo/photo.component";
import {NewPhotoComponent} from "../new-photo/new-photo.component";
import {combineLatest, Observable} from "rxjs";
import {LoadingPopupComponent} from "../../../popups/loading-popup/loading-popup.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home-admin.component.html',
  styleUrls: [
	  '../../../../shared/global/css/text-editor.css',
		'./home-admin.component.css'
  ]
})
export class HomeAdminComponent {

	@ViewChild("sliderPhoto", { read: ViewContainerRef }) vcr!: ViewContainerRef;
	refNewPhoto!: ComponentRef<NewPhotoComponent>
	newPhotoComponents: NewPhotoComponent[] = [];

	imagesSlider: string[] = [];
	mapPhotoUrl: Map<string, string> = new Map();
	isDataLoaded: boolean = false;

	homePageInfo!: HomePageData;
	sliderEnDescription = new FormControl(
		'', [Validators.required]
	);
	sliderItDescription = new FormControl(
		'', [Validators.required]
	);
	sliderKoDescription = new FormControl(
		'', [Validators.required]
	);

	submitted: boolean = false;
	removedPhotos: string[] = [];

	constructor(
		private router: Router,
		private dialog: MatDialog,
		private homeService: HomeService
	) {
		this.homeService.getHomePageInfo().subscribe(info=> {
			if (info.data()) {
				this.homePageInfo = info.data() as HomePageData;

				this.sliderEnDescription = new FormControl(
					this.homePageInfo.en.sliderDescription,
					[Validators.required]
				);
				this.sliderItDescription = new FormControl(
					this.homePageInfo.it.sliderDescription,
					[Validators.required]
				);this.sliderKoDescription = new FormControl(
					this.homePageInfo.ko.sliderDescription,
					[Validators.required]
				);

				this.homePageInfo.photos.forEach(photo=> {
					const path= '/home_page/slider/' + photo;

					this.homeService.getDownloadURL(path).subscribe(url=>{
						this.imagesSlider.push(url);
						this.mapPhotoUrl.set(
							photo,
							url
						)
					});
				});

				this.isDataLoaded = true;
			}
		})
	}

	removePhotoFromSlider(photo: string) {
		if (confirm("Are you sure you want to delete the selected slider's image?")) {
			let filename = '';
			this.mapPhotoUrl.forEach((value: string, key: string) => {
				if (value == photo) {
					filename = key;
				}
			});
			this.mapPhotoUrl.delete(filename);
			this.removedPhotos.push(filename);
			const index = this.imagesSlider.indexOf(photo);

			if (index > -1) {
				this.imagesSlider.splice(index, 1);
			}
			return;
		} else {
			return;
		}

	}

	addNewImageSlider() {
		this.refNewPhoto = this.vcr.createComponent(NewPhotoComponent);
		this.newPhotoComponents.push(this.refNewPhoto.instance);
	}

	submitChanges() {
		this.submitted = true;

		if (
			this.checkValidityDescriptions()
			&&
			this.checkValidityNewPhotos()
		){
			this.modifyHomePage();
		}
	}

	checkValidityDescriptions() {
		let validity: boolean = true;
		if (this.sliderEnDescription.invalid) {
			validity = false;
			window.alert('An english slider description is required')
		}
		if (this.sliderItDescription.invalid) {
			validity = false;
			window.alert('An italian slider description is required')
		}
		if (this.sliderKoDescription.invalid) {
			validity = false;
			window.alert('A korean slider description is required')
		}
		return validity;
	}

	checkValidityNewPhotos() {
		let validity = true;
		this.newPhotoComponents.forEach(component => {

			if (component.formPhoto.invalid) {
				window.alert("Photo/Photos uploaded is/are invalid");
				validity = false;
			}
		});

		return validity;
	}

	modifyHomePage() {
		const arrayUploadingFiles: File[] = [];

		const newPhotosNames: string[] = [];
		this.mapPhotoUrl.forEach((value, key) => {
			newPhotosNames.push(key);
		});
		this.newPhotoComponents.forEach(component=> {
			if (component.photoUploaded instanceof File) {
				arrayUploadingFiles.push(component.photoUploaded);
				let filename: string = component.formPhoto.get('photo')!.value;

				filename = filename.split('\\').pop() as string;

				newPhotosNames.push(
					filename
				);
			}
		});


		const newHomePageInfo: HomePageData = {
			en: {
				sliderDescription: this.sliderEnDescription.value as string,
			},
			it: {
				sliderDescription: this.sliderItDescription.value as string,
			},
			ko: {
				sliderDescription: this.sliderKoDescription.value as string,
			},
			photos: newPhotosNames, // Initialize photos as an empty array
		};


		this.removedPhotos.forEach(filename=> {
			this.homeService.deleteFile(filename);
		})

		this.homeService.modifyHomePage(newHomePageInfo).then(_ => {
			const uploadObservables: Observable<number | undefined>[] = [];

			for (let file of arrayUploadingFiles) {
				uploadObservables.push(this.homeService.uploadFile(file));
			}

			if (uploadObservables.length == 0) {
				const dialogRef = this.dialog.open(LoadingPopupComponent, {
					width: '1000px',
					height: '350px',
					maxHeight: '350px',
					disableClose: true,
					data: {
						uploadPercentage: 100,
						message: 'Home page modified successfully',
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

				combineLatest(uploadObservables).subscribe(percentages => {
					const totalPercentage = percentages.reduce(
						(total, current) => (total as number) + (current as number), 0
					);
					console.log(`Uploaded percentage ${(totalPercentage as number) / uploadObservables.length}`);
					dialogRef.componentInstance.updateUploadPercentage(
						(totalPercentage as number) / uploadObservables.length
					);
				});

				dialogRef.afterClosed().subscribe(message =>{
					if (message == 'new-update') {
						window.location.reload();
					}
					if (message == 'main-page') {
						this.router.navigate(['admin']);
					}
				});

			} else {
				const dialogRef = this.dialog.open(LoadingPopupComponent, {
					width: '1000px',
					height: '350px',
					maxHeight: '350px',
					disableClose: true,
					data: {
						uploadPercentage: 0,
						message: 'Home page modified successfully',
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

				combineLatest(uploadObservables).subscribe(percentages => {
					const totalPercentage = percentages.reduce(
						(total, current) => (total as number) + (current as number), 0
					);
					console.log(`Uploaded percentage ${(totalPercentage as number) / uploadObservables.length}`);
					dialogRef.componentInstance.updateUploadPercentage(
						(totalPercentage as number) / uploadObservables.length
					);
				});
				dialogRef.afterClosed().subscribe(message =>{
					if (message == 'new-update') {
						window.location.reload();
					}
					if (message == 'main-page') {
						this.router.navigate(['admin']);
					}
				});
			}
		});
	}
}
