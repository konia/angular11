import { TabsComponent } from './components/tabs/tabs.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridDirective } from '../directives/grid.directive';
import { BannerComponent } from './components/banner/banner.component';

@NgModule({
  declarations: [GridDirective, BannerComponent, TabsComponent],
  imports: [CommonModule, FormsModule],
  exports: [CommonModule, FormsModule, GridDirective, BannerComponent, TabsComponent]
})
export class SharedModule { }
