import {Component, ComponentRef, ViewChild, ViewContainerRef} from '@angular/core';
import {editorConfig} from "../../../../shared/global/variables/global";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {fileTypeValidator} from "../../../../shared/controls/file-type/filetype";
import {PhotoComponent} from "../../photo/photo/photo.component";
import {futureDateValidator} from "../../../../shared/controls/date/date";
import {Event, EventDetails, Subparagraph} from "../../../../shared/models/event/event";
import {EventService} from "../../../../shared/services/model/event/event.service";


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

  constructor(private eventService: EventService) {
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

    if (this.eventForm.invalid) {
      if (this.eventForm.get('address')?.invalid) {
        window.alert("Address is required");
        return;
      }
      if (this.eventForm.get('date')?.invalid) {
        window.alert("Date is required or not valid");
        return;
      }
      if (this.eventForm.get('coverPhoto')?.invalid) {
        window.alert("A cover photo is required or not valid");
        return;
      }
    }
    if (this.titleForm.invalid) {
      if (this.titleForm.get('enTitle')?.invalid) {
        window.alert("English title required");
        return;
      }
      if (this.titleForm.get('itTitle')?.invalid) {
        window.alert("Italian title required");
        return;
      }
      if (this.titleForm.get('koTitle')?.invalid) {
        window.alert("Korean title required");
        return;
      }
    }
    if (!this.htmlContentEn) {
      window.alert("English paragraph is empty");
      return;
    }
    if (!this.htmlContentIt) {
      window.alert("Italian paragraph is empty");
      return;
    }
    if (!this.htmlContentKo) {
      window.alert("Korean paragraph is empty");
      return;
    }

    const newEvent = new Event();

    const eventDetailsEn = new EventDetails();
    this.populateEventDetails(
      eventDetailsEn,
      this.titleForm.get('enTitle')?.value,
      this.htmlContentEn,
      this.englishComponents
    );
    newEvent.en = eventDetailsEn;

    const eventDetailsIt = new EventDetails();
    this.populateEventDetails(
      eventDetailsIt,
      this.titleForm.get('itTitle')?.value,
      this.htmlContentIt,
      this.italianComponents
    );
    newEvent.it = eventDetailsIt;

    const eventDetailsKo = new EventDetails();
    this.populateEventDetails(
      eventDetailsKo,
      this.titleForm.get('koTitle')?.value,
      this.htmlContentKo,
      this.koreanComponents
    );
    newEvent.ko = eventDetailsKo;

    let fullPath = this.eventForm.get('coverPhoto')?.value;
    newEvent.photo = fullPath.split('\\').pop();
    newEvent.address = this.eventForm.get('address')?.value;
    newEvent.date_time = this.eventForm.get('date')?.value;

    this.eventService.create(newEvent);
    window.alert("Event created");
  }

  populateEventDetails(eventDetails: EventDetails, titleValue: string, htmlContent: string, components: PhotoComponent[]) {
    eventDetails.title = titleValue;
    eventDetails.description = htmlContent;
    eventDetails.subparagraphs = [];

    components.forEach((component, index) => {
      const componentData = component.formPhoto;
      const subparagraph = new Subparagraph();
      if (componentData.get('photo')?.value) {
        let fullPath = componentData.get('photo')?.value;
        subparagraph.photo = fullPath.split('\\').pop();
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
