import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageEditorComponent } from './image-editor.component';

@NgModule({
  declarations: [ImageEditorComponent],
  imports: [
    CommonModule
  ],
  exports: [ImageEditorComponent]
})
export class ImageEditorModule { }
