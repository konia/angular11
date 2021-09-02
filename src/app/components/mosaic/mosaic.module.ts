import { MosaicComponent } from './mosaic.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [MosaicComponent],
  imports: [
    CommonModule
  ],
  exports: [
    MosaicComponent
  ]
})
export class MosaicModule { }
