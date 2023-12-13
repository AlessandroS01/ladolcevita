import {Component, ComponentRef, ViewChild, ViewContainerRef} from '@angular/core';
import {PhotoComponent} from "../../photo/photo/photo.component";
import {Event} from "../../../../shared/models/event/event";
import {FormControl, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {EventService} from "../../../../shared/services/model/event/event.service";
import {Details, Subparagraph} from "../../../../shared/models/common/details-subparagraphs";
import {fileTypeValidator} from "../../../../shared/controls/file-type/filetype";
import {ArticleService} from "../../../../shared/services/model/article/article.service";
import {Article} from "../../../../shared/models/article/article";
import {editorConfig} from "../../../../shared/global/variables/global";
import {Member} from "../../../../shared/models/member/member";
import {MemberService} from "../../../../shared/services/model/member/member.service";
import {Timestamp} from "@firebase/firestore";
import {combineLatest, Observable} from "rxjs";
import {LoadingPopupComponent} from "../../../popups/loading-popup/loading-popup.component";

const imageValidator = fileTypeValidator(['png', 'jpg', 'jpeg']);

@Component({
  selector: 'app-modify-articles',
  templateUrl: './articles-modify.component.html',
  styleUrls: [
    '../../../../shared/global/css/text-editor.css',
    './articles-modify.component.css'
  ]
})
export class ArticlesModifyComponent {

  memberList: Member[] = [];
  writerEmail: string = '';

  @ViewChild("englishTextEditor", { read: ViewContainerRef }) vcrEn!: ViewContainerRef;
  refEnglish!: ComponentRef<PhotoComponent>
  englishComponents: PhotoComponent[] = [];

  @ViewChild("italianTextEditor", { read: ViewContainerRef }) vcrIt!: ViewContainerRef;
  refItalian!: ComponentRef<PhotoComponent>
  italianComponents: PhotoComponent[] = [];

  @ViewChild("koreanTextEditor", { read: ViewContainerRef }) vcrKo!: ViewContainerRef;
  refKorean!: ComponentRef<PhotoComponent>
  koreanComponents: PhotoComponent[] = [];

  selectedLanguage= 'english';

  article: Article = new Article();
  isDataLoaded: boolean = false;

  lectureFormControl: FormControl<number | null> = new FormControl(0, [Validators.required])
  dateFormControl = new FormControl('', [Validators.required]);
  coverPhotoFormControl = new FormControl('', [Validators.required, imageValidator]);

  titleEnFormControl = new FormControl('', [Validators.required]);
  titleItFormControl = new FormControl('', [Validators.required]);
  titleKoFormControl = new FormControl('', [Validators.required]);
  htmlContentEn = '';
  htmlContentIt = '';
  htmlContentKo = '';

  submitted: boolean = false;

  coverPhotoUploaded: any;

	protected readonly editorConfig = editorConfig;

	constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private articleService: ArticleService,
    private memberService: MemberService
  ) {
    this.route.params.subscribe(params => {
      const articleId = params['id'];

      this.articleService.getArticlesById(articleId).subscribe(article=> {
        if (article != null) {
          this.article = article;

					this.memberService.getAll().subscribe(members=> {
						this.memberList = members;

						this.memberList.sort((a, b) => {
							if (a.email === article.email) {
								return -1; // Move 'a' (member with specific email) to the beginning
							} else if (b.email === article.email) {
								return 1; // Move 'b' (member with specific email) to the beginning
							} else {
								return 0;
							}
						})

						this.writerEmail = article.email!;

						this.articleService.getCoverPhotoArticle(article).subscribe(photo=> {
							this.lectureFormControl = new FormControl(
								parseInt(article.lecture_time as string),
								[
									Validators.required,
								]
							);

							const isoLikeString = `${article.date_time?.toDate().getFullYear()}-${
								String((article.date_time?.toDate().getMonth() as number) + 1).padStart(2, '0')
							}-${
								String(article.date_time?.toDate().getDate()).padStart(2, '0')
							}`;

							this.dateFormControl = new FormControl(
								isoLikeString,
								[
									Validators.required
								]
							);

							this.articleService.getCoverPhotoArticle(this.article).subscribe(photo => {
								this.coverPhotoUploaded = article.photo;

								this.changePropertyImageContainer('uploaded');

								const imgElement = document.getElementById('uploaded-image') as HTMLImageElement;
								imgElement.src = photo;
							})

							this.coverPhotoFormControl = new FormControl(
								'',
								[
									Validators.required,
									imageValidator
								]
							);

							this.titleEnFormControl = new FormControl(
								article.en?.title!, [Validators.required]
							);
							this.titleItFormControl = new FormControl(
								article.it?.title!, [Validators.required]
							);
							this.titleKoFormControl = new FormControl(
								article.ko?.title!, [Validators.required]
							);

							this.htmlContentEn = article.en?.description!;
							this.htmlContentIt = article.it?.description!;
							this.htmlContentKo = article.ko?.description!;

							this.initializeLanguageComponents(
								this.englishComponents,
								article.en?.subparagraphs!,
								'english'
							);
							this.initializeLanguageComponents(
								this.italianComponents,
								article.it?.subparagraphs!,
								'italian'
							);
							this.initializeLanguageComponents(
								this.koreanComponents,
								article.ko?.subparagraphs!,
								'korean'
							);

						});
						this.isDataLoaded = true;
					})


        }
      })
    });
  }

	onWriterChange(event: any) {
		const memberValue: string = event.target.value;
		this.writerEmail = memberValue.split('/ ').pop() as string;
	}

  initializeLanguageComponents(
    component: PhotoComponent[],
    subparagraphs: Subparagraph[],
    language: string
  ) {
    subparagraphs.forEach(subPara=> {
      this.initializePhotos(
        language,
        subPara
      )
    })
  }


  changePropertyImageContainer(action: string) {
    const div = document.getElementById('im-cont');
    if (div != null) {
      if (action === 'removed') {
        if (!div.classList.contains('hidden')) {
          div.classList.add('hidden');
        }
      } else if (action === 'uploaded'){
        if (div.classList.contains('hidden')) {
          div.classList.remove('hidden');
        }
      }
    }
  }


  initializePhotos(language: string, subPara: Subparagraph) {
    switch (language) {
      case 'english': {
        this.refEnglish = this.vcrEn.createComponent(PhotoComponent);
        this.refEnglish.instance.htmlContent = subPara.description!;
        if (subPara.photo != '') {
          this.refEnglish.instance.initialPhoto = subPara.photo!;
        }
        this.englishComponents.push(this.refEnglish.instance);
        break;
      }
      case 'italian': {
        this.refItalian = this.vcrIt.createComponent(PhotoComponent);
        this.refItalian.instance.htmlContent = subPara.description!;
        if (subPara.photo != '') {
          this.refItalian.instance.initialPhoto = subPara.photo!;
        }
        this.italianComponents.push(this.refItalian.instance);
        break;
      }
      case 'korean': {
        this.refKorean = this.vcrKo.createComponent(PhotoComponent);
        this.refKorean.instance.htmlContent = subPara.description!;
        if (subPara.photo != '') {
          this.refKorean.instance.initialPhoto = subPara.photo!;
        }
        this.koreanComponents.push(this.refKorean.instance);
        break;
      }
    }
  }

  onFileChange(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile != null) {
      this.coverPhotoUploaded = selectedFile;

      this.changePropertyImageContainer('uploaded');

      const imageUrl = URL.createObjectURL(selectedFile);
      const imgElement = document.getElementById('uploaded-image') as HTMLImageElement;
      imgElement.src = imageUrl;
    } else {
      this.changePropertyImageContainer('removed');
    }
  }

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

  addNewPhoto(language: string) {
    switch (language) {
      case 'english': {
        this.refEnglish = this.vcrEn.createComponent(PhotoComponent);
        this.englishComponents.push(this.refEnglish.instance);
        break;
      }
      case 'italian': {
        this.refItalian = this.vcrIt.createComponent(PhotoComponent);
        this.italianComponents.push(this.refItalian.instance);
        break;
      }
      case 'korean': {
        this.refKorean = this.vcrKo.createComponent(PhotoComponent);
        this.koreanComponents.push(this.refKorean.instance);
        break;
      }
    }
  }

	submitForm() {
		this.submitted = true;

		if (
			this.checkValidityMainInfo() && this.checkValidityContent() &&
			this.checkValidityImagesComponents(this.englishComponents, 'english') &&
			this.checkValidityImagesComponents(this.italianComponents, 'italian') &&
			this.checkValidityImagesComponents(this.koreanComponents, 'korean')
		){
			const coverPhotoChanged: boolean = this.coverPhotoFormControl.dirty && this.coverPhotoFormControl.valid;

			this.modifyExistingArticle(coverPhotoChanged);
		}
	}

	private checkValidityMainInfo(): boolean {
		let validity = true;

		if (this.writerEmail == '') {
			window.alert("Please select the writer");
			validity = false;
		}
		if (this.lectureFormControl.invalid) {
			window.alert("Lecture time is required or not valid");
			validity = false;
		}
		if (this.dateFormControl.invalid) {
			window.alert("Date is required or not valid");
			validity = false;
		}
		if (this.coverPhotoFormControl.invalid && this.coverPhotoFormControl.dirty) {
			window.alert("A cover photo is required or not valid");
			validity = false;
		}

		return validity;
	}

	private checkValidityContent(): boolean {
		let validity = true;

		if (this.titleEnFormControl.invalid) {
			window.alert("English title required");
			validity = false;
		}
		if (this.titleItFormControl.invalid) {
			window.alert("Italian title required");
			validity = false;
		}
		if (this.titleKoFormControl.invalid) {
			window.alert("Korean title required");
			validity = false;
		}

		if (!this.htmlContentEn) {
			window.alert("English paragraph is empty");
			validity = false;
		}
		if (!this.htmlContentIt) {
			window.alert("Italian paragraph is empty");
			validity = false;
		}
		if (!this.htmlContentKo) {
			window.alert("Korean paragraph is empty");
			validity = false;
		}
		return validity;
	}

	checkValidityImagesComponents(components: PhotoComponent[], language: string): boolean {
		let validity: boolean = true;
		components.forEach(component => {
			if (component.formPhoto.invalid) {
				window.alert("Photo/Photos uploaded in "+ language + " language is/are invalid");
				validity = false;
			}
		});
		return validity;
	}

	private modifyExistingArticle(coverPhotoChanged: boolean) {
		const arrayUploadingFiles: File[] = [];

		const arrayChangedEnFiles: boolean[] = [];
		const arrayChangedItFiles: boolean[] = [];
		const arrayChangedKoFiles: boolean[] = [];

		const updatedArticle = new Article();

		updatedArticle.id = this.article.id;

		if (this.coverPhotoFormControl.value) {
			let fullPath = this.coverPhotoFormControl.value;
			updatedArticle.photo = fullPath.split('\\').pop();
			arrayUploadingFiles.push(this.coverPhotoUploaded as File);
		} else {
			updatedArticle.photo = this.article.photo;
		}

		const articleDetailsEn = new Details();
		this.populateArticleDetails(
			articleDetailsEn,
			this.titleEnFormControl.value as string,
			this.htmlContentEn,
			this.englishComponents,
			arrayUploadingFiles,
			arrayChangedEnFiles
		);
		updatedArticle.en = articleDetailsEn;

		const articleDetailsIt = new Details();
		this.populateArticleDetails(
			articleDetailsIt,
			this.titleItFormControl.value as string,
			this.htmlContentIt,
			this.italianComponents,
			arrayUploadingFiles,
			arrayChangedItFiles
		);
		updatedArticle.it = articleDetailsIt;

		const articleDetailsKo = new Details();
		this.populateArticleDetails(
			articleDetailsKo,
			this.titleKoFormControl.value as string,
			this.htmlContentKo,
			this.koreanComponents,
			arrayUploadingFiles,
			arrayChangedKoFiles
		);
		updatedArticle.ko = articleDetailsKo;

		updatedArticle.lecture_time = this.lectureFormControl.value?.toString();

		updatedArticle.email = this.writerEmail;

		updatedArticle.date_time = Timestamp.fromDate(new Date(this.dateFormControl.value!));

		if (this.checkPhotoNames(updatedArticle)) {

			this.changePhotosInsideStorage(
				this.article.en?.subparagraphs!,
				updatedArticle,
				arrayChangedEnFiles,
			);
			this.changePhotosInsideStorage(
				this.article.it?.subparagraphs!,
				updatedArticle,
				arrayChangedItFiles,
			);
			this.changePhotosInsideStorage(
				this.article.ko?.subparagraphs!,
				updatedArticle,
				arrayChangedKoFiles,
			);

			if (
				this.coverPhotoUploaded instanceof File
			) {
				this.articleService.deleteFile(
					updatedArticle,
					this.article.photo!
				)
			}

			this.articleService.update(
				this.article,
				updatedArticle
			).subscribe(() => {
				const uploadObservables: Observable<number | undefined>[] = [];

				for (let file of arrayUploadingFiles) {
					uploadObservables.push(this.articleService.uploadFile(file, parseInt(this.article.id!)));
				}

				const dialogRef = arrayUploadingFiles.length > 0
					? this.dialog.open(
						LoadingPopupComponent, {
							width: '1000px',
							height: '350px',
							maxHeight: '350px',
							disableClose: true,
							data: {
								uploadPercentage: 0,
								message: 'Article updated successfully',
								create: {
									title: 'New article',
									value: 'new-article'
								},
								view: {
									title: 'See articles',
									value: 'see-articles'
								},
								main: {
									title: 'Main page',
									value: 'main-page'
								}
							} // Initial value, it will be updated
						})
					: this.dialog.open(
						LoadingPopupComponent, {
							width: '1000px',
							height: '350px',
							maxHeight: '350px',
							disableClose: true,
							data: {
								uploadPercentage: 100,
								message: 'Article updated successfully',
								create: {
									title: 'New article',
									value: 'new-article'
								},
								view: {
									title: 'See articles',
									value: 'see-articles'
								},
								main: {
									title: 'Main page',
									value: 'main-page'
								}
							} // Initial value, it will be updated
						});

				if (uploadObservables.length > 0 ){
					combineLatest(uploadObservables).subscribe(percentages => {
						const totalPercentage = percentages.reduce(
							(total, current) => (total as number) + (current as number), 0
						);
						console.log(`Uploaded percentage ${(totalPercentage as number) / uploadObservables.length}`);
						dialogRef.componentInstance.updateUploadPercentage(
							(totalPercentage as number) / uploadObservables.length
						);
					});
				}

				dialogRef.afterClosed().subscribe(message =>{
					if (message == 'new-article') {
						window.location.reload();
					}
					if (message == 'main-page') {
						this.router.navigate(['admin']);
					}
					if (message == 'see-articles') {
						this.router.navigate(['admin/articles/view']);
					}
				});
			})

		} else {
			window.alert('Some photos have the same name. Please change them.')
		}
	}

	checkPhotoNames(updatedArticle: Article): boolean {
		const photoSet = new Set<string>();
		let counter = 0;

		console.log(updatedArticle.photo!)

		photoSet.add(updatedArticle.photo as string);
		counter++;

		counter = this.addPhotoNamesToSetCollection(
			photoSet,
			updatedArticle.en?.subparagraphs!,
			counter
		);
		counter = this.addPhotoNamesToSetCollection(
			photoSet,
			updatedArticle.it?.subparagraphs!,
			counter
		);
		counter = this.addPhotoNamesToSetCollection(
			photoSet,
			updatedArticle.ko?.subparagraphs!,
			counter
		);

		console.log(photoSet)
		console.log(counter)

		return counter == photoSet.size;
	}
	addPhotoNamesToSetCollection(
		photoSet: Set<string>,
		subparagraphs: Subparagraph[],
		counter: number
	): number {

		subparagraphs.forEach(sub => {
			if (sub.photo!) {
				photoSet.add(sub.photo!);
				counter++;
			}
		});
		return counter;
	}

	changePhotosInsideStorage(
		subparagraphs: Subparagraph[],
		updatedArticle: Article,
		arrayChangedFiles: boolean[],
	) {
		arrayChangedFiles.forEach((isChanged: boolean, index: number) => {
			if (isChanged && subparagraphs.at(index)) {
				const namePhoto: string = subparagraphs.at(index)!.photo as string;
				this.articleService.deleteFile(updatedArticle, namePhoto);
			}
		})
	}

	populateArticleDetails(
		articleDetails: Details,
		titleValue: string,
		htmlContent: string,
		components: PhotoComponent[],
		uploadingFiles: File[],
		changedFiles: boolean[]
	) {
		articleDetails.title = titleValue;
		articleDetails.description = htmlContent;
		articleDetails.subparagraphs = [];

		components.forEach((component, index) => {
			const componentData = component.formPhoto;
			const subparagraph = new Subparagraph();
			if (component.photoUploaded instanceof File) {
				const photo = component.photoUploaded;

				let fullPath = componentData.get('photo')?.value;
				subparagraph.photo = fullPath.split('\\').pop();
				uploadingFiles.push(photo);
				changedFiles.push(true);
			} else if (component.photoUploaded == null && component.initialPhoto != null){
				subparagraph.photo = component.initialPhoto;
				changedFiles.push(false);
			} else if (component.photoUploaded == null && component.initialPhoto == null) {
				subparagraph.photo = '';
				changedFiles.push(true);
			}
			else if (component.initialPhoto == null) {
				subparagraph.photo = '';
				changedFiles.push(false);
			}
			if (component.htmlContent != null) {
				subparagraph.description = component.htmlContent;
			}
			if (subparagraph.description != '' || subparagraph.photo != '') {
				articleDetails.subparagraphs!.push(subparagraph);
			}
		});
	}

}
