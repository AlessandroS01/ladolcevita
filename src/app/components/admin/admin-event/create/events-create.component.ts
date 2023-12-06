import {Component, ComponentRef, ViewChild, ViewContainerRef} from '@angular/core';
import {editorConfig} from "../../../../shared/global/variables/global";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {fileTypeValidator} from "../../../../shared/controls/file-type/filetype";
import {PhotoComponent} from "../../photo/photo/photo.component";
import {futureDateValidator} from "../../../../shared/controls/date/date";
import {Event, EventDetails, Subparagraph} from "../../../../shared/models/event/event";
import {EventService} from "../../../../shared/services/model/event/event.service";
import {combineLatest, Observable, of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {LoadingPopupComponent} from "../../../popups/loading-popup/loading-popup.component";
import {Router} from "@angular/router";


const imageValidator = fileTypeValidator(['png', 'jpg', 'jpeg']);
const futureDateValidation = futureDateValidator();

@Component({
  selector: 'app-create',
  templateUrl: './events-create.component.html',
  styleUrls: [
    '../../../../shared/global/css/text-editor.css',
    './events-create.component.css'
  ]
})
export class EventsCreateComponent {

  constructor(
    private eventService: EventService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

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

  htmlContentEn = '';
  htmlContentIt = '';
  htmlContentKo = '';

  coverPhotoUploaded: any;

  protected readonly editorConfig = editorConfig;

  eventForm: FormGroup = new FormGroup({
    address: new FormControl('', [
      Validators.required
    ]),
    date: new FormControl('', [
      Validators.required,
      futureDateValidation
    ]),
    coverPhoto: new FormControl('', [
      Validators.required,
      imageValidator
    ]),
  });

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
  submitted: boolean = false;


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
      this.createNewestEvent();
    }
  }

  checkValidityMainInfo(): boolean {
    let validity = true;
    if (this.eventForm.invalid) {
      if (this.eventForm.get('address')?.invalid) {
        window.alert("Address is required");
        validity = false;
      }
      if (this.eventForm.get('date')?.invalid) {
        window.alert("Date is required or not valid");
        validity = false;
      }
      if (this.eventForm.get('coverPhoto')?.invalid) {
        window.alert("A cover photo is required or not valid");
        validity = false;
      }
    }
    return validity;
  }
  checkValidityContent() {
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

  createNewestEvent() {
    const arrayUploadingFiles: File[] = [];

    const newEvent = new Event();
    arrayUploadingFiles.push(this.coverPhotoUploaded as File);

    const eventDetailsEn = new EventDetails();
    this.populateEventDetails(
      eventDetailsEn,
      this.titleForm.get('enTitle')?.value,
      this.htmlContentEn,
      this.englishComponents,
      arrayUploadingFiles
    );
    newEvent.en = eventDetailsEn;

    const eventDetailsIt = new EventDetails();
    this.populateEventDetails(
      eventDetailsIt,
      this.titleForm.get('itTitle')?.value,
      this.htmlContentIt,
      this.italianComponents,
      arrayUploadingFiles
    );
    newEvent.it = eventDetailsIt;

    const eventDetailsKo = new EventDetails();
    this.populateEventDetails(
      eventDetailsKo,
      this.titleForm.get('koTitle')?.value,
      this.htmlContentKo,
      this.koreanComponents,
      arrayUploadingFiles
    );
    newEvent.ko = eventDetailsKo;

    let fullPath = this.eventForm.get('coverPhoto')?.value;
    newEvent.photo = fullPath.split('\\').pop();
    newEvent.address = this.eventForm.get('address')?.value;
    newEvent.date_time = this.eventForm.get('date')?.value;


    this.eventService.create(newEvent).subscribe(uid => {
      const uploadObservables: Observable<number | undefined>[] = [];

      for (let file of arrayUploadingFiles) {
        uploadObservables.push(this.eventService.uploadFile(file, uid));
      }

      const dialogRef = this.dialog.open(LoadingPopupComponent, {
        width: '1000px',
        height: '350px',
        maxHeight: '350px',
        disableClose: true,
        data: {
          uploadPercentage: 50,
          message: 'Event created successfully'
        } // Initial value, it will be updated
      });

      combineLatest(uploadObservables).subscribe(percentages => {
        const totalPercentage = percentages.reduce(
          (total, current) => (total as number) + (current as number), 0
        );
        console.log(`Uploaded percentage ${(totalPercentage as number) / uploadObservables.length}`);
        dialogRef.componentInstance.updateUploadPercentage((totalPercentage as number) / uploadObservables.length);
      });

      dialogRef.afterClosed().subscribe(message =>{
        if (message == 'new-event') {
          window.location.reload();
        }
        if (message == 'main-page') {
          this.router.navigate(['admin']);
        }
      });

    });
    //window.alert("Event created");
  }

  populateEventDetails(
    eventDetails: EventDetails,
    titleValue: string,
    htmlContent: string,
    components: PhotoComponent[],
    uploadingFiles: File[]
  ) {
    eventDetails.title = titleValue;
    eventDetails.description = htmlContent;
    eventDetails.subparagraphs = [];

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
        eventDetails.subparagraphs!.push(subparagraph);
      }
    });
  }


}
