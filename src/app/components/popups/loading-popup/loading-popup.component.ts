import {Component, Inject, OnChanges, SimpleChanges} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";

@Component({
  selector: 'app-loading-popup',
  templateUrl: './loading-popup.component.html',
  styleUrls: ['./loading-popup.component.css']
})
export class LoadingPopupComponent {

  uploadPercentage: number;
  message: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      uploadPercentage: number,
      message: string,
      create: {
        title: string,
        value: string
      },
      view: {
        title: string,
        value: string
      },
      main: {
        title: string,
        value: string
      }
    },
    private ref: MatDialogRef<LoadingPopupComponent>,
  ) {
    this.uploadPercentage = data.uploadPercentage;
    this.message = data.message;
  }

  updateUploadPercentage(number: number) {
    this.uploadPercentage = Math.ceil(number * 10) / 10;
  }

  closePopup(message= '' ) {
    this.ref.close(message);
  }
}
