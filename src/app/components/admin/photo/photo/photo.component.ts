import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {fileTypeValidator} from "../../../../shared/controls/file-type/filetype";
import {editorConfig} from "../../../../shared/global/variables/global";


const imageValidator = fileTypeValidator(['png', 'jpg', 'jpeg']);

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: [
    '../../../../shared/global/css/text-editor.css',
    './photo.component.css', ]
})
export class PhotoComponent {

  formPhoto: FormGroup = new FormGroup({
    photo: new FormControl('', [
      imageValidator
    ])
  });
  photoUploaded: any;

  htmlContent = '';


  protected readonly editorConfig = editorConfig;

  onChange(event: any) {
    if (this.formPhoto.valid) {
      this.photoUploaded = event.target.files[0];
    }
  }
}
