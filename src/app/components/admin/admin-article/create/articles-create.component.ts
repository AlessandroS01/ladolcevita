import {Component, ComponentRef, ViewChild, ViewContainerRef} from '@angular/core';
import {editorConfig} from "../../../../shared/global/variables/global";
import {PhotoComponent} from "../../photo/photo/photo.component";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {fileTypeValidator} from "../../../../shared/controls/file-type/filetype";
import {futureDateValidator} from "../../../../shared/controls/date/date";
import {MemberService} from "../../../../shared/services/model/member/member.service";
import {Member} from "../../../../shared/models/member/member";
import {Event} from "../../../../shared/models/event/event";
import {Details, Subparagraph} from "../../../../shared/models/common/details-subparagraphs";
import {Timestamp} from "@firebase/firestore";
import {Article} from "../../../../shared/models/article/article";
import {ArticleService} from "../../../../shared/services/model/article/article.service";
import {combineLatest, Observable} from "rxjs";
import {LoadingPopupComponent} from "../../../popups/loading-popup/loading-popup.component";

const imageValidator = fileTypeValidator(['png', 'jpg', 'jpeg']);

@Component({
  selector: 'app-create-articles',
  templateUrl: './articles-create.component.html',
  styleUrls: [
    './articles-create.component.css',
    '../../../../shared/global/css/text-editor.css'
  ]
})
export class ArticlesCreateComponent {

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

  protected readonly editorConfig = editorConfig;

  articleForm: FormGroup = new FormGroup({
    lecture: new FormControl(
      '', [
      Validators.required,
      Validators.min(1),
      Validators.max(60),
    ]),
    date: new FormControl(
      new Date().toISOString().slice(0, 10), [
      Validators.required
    ]),
    coverPhoto: new FormControl('', [
      Validators.required,
      imageValidator
    ]),
  });


  submitted: boolean = false;
  coverPhotoUploaded: any;
  selectedLanguage: string = 'english';
  titleForm: FormGroup = new FormGroup({
    enTitle: new FormControl('', [
      Validators.required
    ]),
    itTitle: new FormControl('', [
      Validators.required
    ]),
    koTitle: new FormControl('', [
      Validators.required
    ]),
  });


  htmlContentEn: string = '';
  htmlContentIt: string = '';
  htmlContentKo: string = '';

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private articleService: ArticleService,
    private memberService: MemberService
  ) {
    this.memberService.getAll().subscribe(members=> {
      this.memberList = members;
      if (members.at(0)) {
        this.writerEmail = members.at(0)!.email as string;
      }
    })
  }

  onWriterChange(event: any) {
    const memberValue: string = event.target.value;
    this.writerEmail = memberValue.split('/ ').pop() as string;
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

  private changePropertyImageContainer(action: string) {
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
      this.createNewestArticle();
    }
  }

  private checkValidityMainInfo(): boolean {
    let validity = true;
    if (this.articleForm.invalid) {
      if (this.writerEmail == '') {
        window.alert("Please select the writer");
        validity = false;
      }
      if (this.articleForm.get('lecture')?.invalid) {
        window.alert("Lecture time is required or not valid");
        validity = false;
      }
      if (this.articleForm.get('date')?.invalid) {
        window.alert("Date is required or not valid");
        validity = false;
      }
      if (this.articleForm.get('coverPhoto')?.invalid) {
        window.alert("A cover photo is required or not valid");
        validity = false;
      }
    }
    return validity;
  }

  private checkValidityContent(): boolean {
    let validity = true;
    if (this.titleForm.invalid) {
      if (this.titleForm.get('enTitle')?.invalid) {
        window.alert("English title required");
        validity = false;
      }
      if (this.titleForm.get('itTitle')?.invalid) {
        window.alert("Italian title required");
        validity = false;
      }
      if (this.titleForm.get('koTitle')?.invalid) {
        window.alert("Korean title required");
        validity = false;
      }
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

  private createNewestArticle() {
    const arrayUploadingFiles: File[] = [];

    const newArticle = new Article();
    arrayUploadingFiles.push(this.coverPhotoUploaded as File);

    const articleDetailsEn = new Details();
    this.populateArticleDetails(
      articleDetailsEn,
      this.titleForm.get('enTitle')?.value,
      this.htmlContentEn,
      this.englishComponents,
      arrayUploadingFiles
    );
    newArticle.en = articleDetailsEn;

    const articleDetailsIt = new Details();
    this.populateArticleDetails(
      articleDetailsIt,
      this.titleForm.get('itTitle')?.value,
      this.htmlContentIt,
      this.italianComponents,
      arrayUploadingFiles
    );
    newArticle.it = articleDetailsIt;

    const articleDetailsKo = new Details();
    this.populateArticleDetails(
      articleDetailsKo,
      this.titleForm.get('koTitle')?.value,
      this.htmlContentKo,
      this.koreanComponents,
      arrayUploadingFiles
    );
    newArticle.ko = articleDetailsKo;

		newArticle.lecture_time = this.articleForm.get('lecture')?.value as string;

    let fullPath = this.articleForm.get('coverPhoto')?.value;
    newArticle.photo = fullPath.split('\\').pop();
    newArticle.email = this.writerEmail;

    newArticle.date_time = Timestamp.fromDate(new Date(this.articleForm.get('date')?.value));

    if (this.checkPhotoNames(newArticle)) {
      this.articleService.create(newArticle).subscribe(uid=> {
        const uploadObservables: Observable<number | undefined>[] = [];

        for (let file of arrayUploadingFiles) {
          uploadObservables.push(this.articleService.uploadFile(file, uid));
        }

        const dialogRef = this.dialog.open(LoadingPopupComponent, {
          width: '1000px',
          height: '350px',
          maxHeight: '350px',
          disableClose: true,
          data: {
            uploadPercentage: 0,
            message: 'Article created successfully',
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

  checkPhotoNames(newArticle: Article): boolean {
    const photoSet = new Set<string>();
    let counter = 0;

    photoSet.add(newArticle.photo!);
    counter++;

    counter = this.addPhotoNamesToSetCollection(
      photoSet,
      newArticle.en?.subparagraphs!,
      counter
    );
    counter = this.addPhotoNamesToSetCollection(
      photoSet,
      newArticle.it?.subparagraphs!,
      counter
    );
    counter = this.addPhotoNamesToSetCollection(
      photoSet,
      newArticle.ko?.subparagraphs!,
      counter
    );

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

  populateArticleDetails(
    articleDetails: Details,
    titleValue: string,
    htmlContent: string,
    components: PhotoComponent[],
    uploadingFiles: File[]
  ) {
    articleDetails.title = titleValue;
    articleDetails.description = htmlContent;
    articleDetails.subparagraphs = [];

    components.forEach((component, index) => {
      const componentData = component.formPhoto;
      const subparagraph = new Subparagraph();
      if (componentData.get('photo')?.value && component.photoUploaded instanceof File) {
        const photo = component.photoUploaded;

        let fullPath = componentData.get('photo')?.value;
        subparagraph.photo = fullPath.split('\\').pop();
        uploadingFiles.push(photo);
      } else {
        subparagraph.photo = '';
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
