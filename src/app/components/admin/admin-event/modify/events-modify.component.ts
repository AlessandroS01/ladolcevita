import {Component, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EventService} from "../../../../shared/services/model/event/event.service";
import {Event} from "../../../../shared/models/event/event";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {fileTypeValidator} from "../../../../shared/controls/file-type/filetype";
import {futureDateValidator} from "../../../../shared/controls/date/date";
import {formatDate} from "@angular/common";
import {editorConfig} from "../../../../shared/global/variables/global";
import {PhotoComponent} from "../../photo/photo/photo.component";
import {Timestamp} from "@firebase/firestore";
import {combineLatest, Observable} from "rxjs";
import {LoadingPopupComponent} from "../../../popups/loading-popup/loading-popup.component";
import {MatDialog} from "@angular/material/dialog";
import {Details, Subparagraph} from "../../../../shared/models/common/details-subparagraphs";


const imageValidator = fileTypeValidator(['png', 'jpg', 'jpeg']);
const futureDateValidation = futureDateValidator();


@Component({
  selector: 'app-events-modify',
  templateUrl: 'events-modify.component.html',
  styleUrls: [
    '../../../../shared/global/css/text-editor.css',
    './events-modify.component.css'
  ]
})
export class EventsModifyComponent implements OnInit {

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

  event: Event = new Event();
  isDataLoaded: boolean = false;

  addressFormControl = new FormControl('', [Validators.required]);
  dateFormControl = new FormControl('', [Validators.required, futureDateValidation]);
  coverPhotoFormControl = new FormControl('', [Validators.required, imageValidator]);

  titleEnFormControl = new FormControl('', [Validators.required]);
  titleItFormControl = new FormControl('', [Validators.required]);
  titleKoFormControl = new FormControl('', [Validators.required]);
  htmlContentEn = '';
  htmlContentIt = '';
  htmlContentKo = '';


  protected readonly editorConfig = editorConfig;
  submitted: boolean = false;

  coverPhotoUploaded: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private eventService: EventService,
  ) {
    this.route.params.subscribe(params => {
      const eventId = params['id'];

      this.eventService.getEventById(eventId).subscribe(event=> {
        if (event != null) {
          this.event = event;

          this.eventService.getCoverPhotoEvent(event).subscribe(photo=> {
            this.addressFormControl = new FormControl(
              event.address as string,
              [
                Validators.required
              ]
            );

            const isoLikeString = `${event.date_time?.toDate().getFullYear()}-${
              String((event.date_time?.toDate().getMonth() as number) + 1).padStart(2, '0')
            }-${
              String(event.date_time?.toDate().getDate()).padStart(2, '0')
            }T${
              String(event.date_time?.toDate().getHours()).padStart(2, '0')
            }:${
              String(event.date_time?.toDate().getMinutes()).padStart(2, '0')
            }`;

            this.dateFormControl = new FormControl(
              isoLikeString,
              [
                Validators.required,
                futureDateValidation
              ]
            );

            this.eventService.getCoverPhotoEvent(this.event).subscribe(photo => {
              this.coverPhotoUploaded = event.photo;

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
              event.en?.title!, [Validators.required]
            );
            this.titleItFormControl = new FormControl(
              event.it?.title!, [Validators.required]
            );
            this.titleKoFormControl = new FormControl(
              event.ko?.title!, [Validators.required]
            );

            this.htmlContentEn = event.en?.description!;
            this.htmlContentIt = event.it?.description!;
            this.htmlContentKo = event.ko?.description!;

            this.initializeLanguageComponents(
              this.englishComponents,
              event.en?.subparagraphs!,
              'english'
            );
            this.initializeLanguageComponents(
              this.italianComponents,
              event.it?.subparagraphs!,
              'italian'
            );
            this.initializeLanguageComponents(
              this.koreanComponents,
              event.ko?.subparagraphs!,
              'korean'
            );

          });
          this.isDataLoaded = true;
        }
      })
    });

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


  ngOnInit() {
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
    /*
    if (
      this.checkValidityMainInfo() && this.checkValidityContent() &&
      this.checkValidityImagesComponents(this.englishComponents, 'english') &&
      this.checkValidityImagesComponents(this.italianComponents, 'italian') &&
      this.checkValidityImagesComponents(this.koreanComponents, 'korean')
    )
     */
      const coverPhotoChanged: boolean = this.coverPhotoFormControl.dirty && this.coverPhotoFormControl.valid;

      this.modifyExistingEvent(coverPhotoChanged);
  }

  checkValidityMainInfo(): boolean {
    let validity = true;

    if (this.addressFormControl.invalid) {
      window.alert("Address is required");
      validity = false;
    }
    if (this.dateFormControl.invalid) {
      window.alert("Date is required or not valid");
      validity = false;
    }if (this.coverPhotoFormControl.invalid && this.coverPhotoFormControl.dirty) {
      window.alert("A cover photo is required or not valid");
      validity = false;
    }

    return validity;
  }
  checkValidityContent() {
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

  private modifyExistingEvent(coverPhotoChanged: boolean) {
    const arrayUploadingFiles: File[] = [];

    const arrayChangedEnFiles: boolean[] = [];
    const arrayChangedItFiles: boolean[] = [];
    const arrayChangedKoFiles: boolean[] = [];

    const updatedEvent = new Event();

    if (this.coverPhotoFormControl.value) {
      let fullPath = this.coverPhotoFormControl.value;
      updatedEvent.photo = fullPath.split('\\').pop();
      arrayUploadingFiles.push(this.coverPhotoUploaded as File);
    } else {
      updatedEvent.photo = this.event.photo;
    }

    updatedEvent.address = this.addressFormControl.value!;
    updatedEvent.date_time = Timestamp.fromDate(new Date(this.dateFormControl.value!));

    const eventDetailsEn = new Details();
    this.populateEventDetails(
      eventDetailsEn,
      this.titleEnFormControl.value!,
      this.htmlContentEn,
      this.englishComponents,
      arrayUploadingFiles,
      arrayChangedEnFiles
    );
    updatedEvent.en = eventDetailsEn;

    const eventDetailsIt = new Details();
    this.populateEventDetails(
      eventDetailsIt,
      this.titleItFormControl.value!,
      this.htmlContentIt,
      this.italianComponents,
      arrayUploadingFiles,
      arrayChangedItFiles
    );
    updatedEvent.it = eventDetailsIt;

    const eventDetailsKo = new Details();
    this.populateEventDetails(
      eventDetailsKo,
      this.titleKoFormControl.value!,
      this.htmlContentKo,
      this.koreanComponents,
      arrayUploadingFiles,
      arrayChangedKoFiles
    );
    updatedEvent.ko = eventDetailsKo;
    updatedEvent.id = this.event.id;


    if (this.checkPhotoNames(updatedEvent)) {

      this.changePhotosInsideStorage(
        this.event.en?.subparagraphs!,
        updatedEvent,
        arrayChangedEnFiles,
      );
      this.changePhotosInsideStorage(
        this.event.it?.subparagraphs!,
        updatedEvent,
        arrayChangedItFiles,
      );
      this.changePhotosInsideStorage(
        this.event.ko?.subparagraphs!,
        updatedEvent,
        arrayChangedKoFiles,
      );

      if (
        this.coverPhotoUploaded instanceof File
      ) {
        this.eventService.deleteFile(
          updatedEvent,
          this.event.photo!
        )
      }


      this.eventService.update(
        this.event,
        updatedEvent
      ).subscribe(() => {
        const uploadObservables: Observable<number | undefined>[] = [];

        for (let file of arrayUploadingFiles) {
          uploadObservables.push(this.eventService.uploadFile(file, parseInt(this.event.id!)));
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
                message: 'Event updated successfully',
                create: {
                  title: 'New event',
                  value: 'new-event'
                },
                view: {
                  title: 'See events',
                  value: 'see-events'
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
                message: 'Event updated successfully'
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
          if (message == 'new-event') {
            this.router.navigate(['admin/events/create']);
          }
          if (message == 'main-page') {
            this.router.navigate(['admin']);
          }
          if (message == 'see-events') {
            this.router.navigate(['admin/events/view']);
          }
        });
      });
    } else {
      window.alert('Some photos have the same name. Please change them.')
    }
  }

  checkPhotoNames(updatedEvent: Event): boolean {
    const photoSet = new Set<string>();
    let counter = 0;

    photoSet.add(updatedEvent.photo!);
    counter++;

    counter = this.addPhotoNamesToSetCollection(
      photoSet,
      updatedEvent.en?.subparagraphs!,
      counter
    );
    counter = this.addPhotoNamesToSetCollection(
      photoSet,
      updatedEvent.it?.subparagraphs!,
      counter
    );
    counter = this.addPhotoNamesToSetCollection(
      photoSet,
      updatedEvent.ko?.subparagraphs!,
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

  changePhotosInsideStorage(
    subparagraphs: Subparagraph[],
    updatedEvent: Event,
    arrayChangedFiles: boolean[],
  ) {
    arrayChangedFiles.forEach((isChanged: boolean, index: number) => {
      if (isChanged && subparagraphs.at(index)) {
        const namePhoto: string = subparagraphs.at(index)!.photo as string;
        this.eventService.deleteFile(updatedEvent, namePhoto);
      }
    })
  }

  populateEventDetails(
    eventDetails: Details,
    titleValue: string,
    htmlContent: string,
    components: PhotoComponent[],
    uploadingFiles: File[],
    changedFiles: boolean[]
  ) {
    eventDetails.title = titleValue;
    eventDetails.description = htmlContent;
    eventDetails.subparagraphs = [];

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
        eventDetails.subparagraphs!.push(subparagraph);
      }
    });
  }

}
