import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ProdComponent } from './prod/prod.component';
import { AgoPipe } from 'src/app/pipe/ago.pipe';
import { ImageEditorModule } from 'src/app/components/image-editor/image-editor.module';

@NgModule({
  declarations: [
    HomeComponent,
    ProdComponent,
    AgoPipe
  ],
  imports: [
    HomeRoutingModule,
    SharedModule,
    ImageEditorModule
  ],
})
export class HomeModule { }
