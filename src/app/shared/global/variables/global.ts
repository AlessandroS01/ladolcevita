import { Injectable } from '@angular/core';
import {AngularEditorConfig} from "@kolkov/angular-editor";

export const editorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: 'auto',
  maxHeight: '500px',
  width: '100%',
  minWidth: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: '',
  defaultFontName: 'Playfair Display',
  defaultFontSize: '3',
  fonts: [
    {class: 'playfair', name: 'Playfair Display'},
    {class: 'arial', name: 'Arial'},
    {class: 'times-new-roman', name: 'Times New Roman'},
    {class: 'calibri', name: 'Calibri'}
  ],
  toolbarHiddenButtons: [
    [
      'subscript',
      'superscript',
      'heading',
      'indent',
      'outdent',
    ],
    [
      'link',
      'unlink',
      'insertImage',
      'insertVideo',
      'removeFormat',
      'toggleEditorMode'
    ]
  ]
};
