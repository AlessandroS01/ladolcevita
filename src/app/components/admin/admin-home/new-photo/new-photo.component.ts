import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {fileTypeValidator} from "../../../../shared/controls/file-type/filetype";


const imageValidator = fileTypeValidator(['png', 'jpg', 'jpeg']);


@Component({
  selector: 'app-new-photo',
  templateUrl: './new-photo.component.html',
  styleUrls: [
		'./new-photo.component.css',
	  '../../../../shared/global/css/text-editor.css',
  ]
})
export class NewPhotoComponent {

	formPhoto: FormGroup = new FormGroup({
		photo: new FormControl('', [
			imageValidator
		])
	});
	photoUploaded: any;


	onChange(event: any) {
		if (this.formPhoto.valid) {
			this.photoUploaded = event.target.files[0];
		}
	}

	removePhoto() {
		this.photoUploaded = null;
		this.formPhoto.reset();
	}
}
