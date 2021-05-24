import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appGrid]'
})
export class GridDirective {
  @HostBinding('style.display') @Input() display = 'grid';
  constructor() { }

}
