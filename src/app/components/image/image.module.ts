import { ImageComponent } from './image.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ImageComponent],
  imports: [
    CommonModule
  ],
  exports: [ImageComponent]
})
export class ImageModule { }
