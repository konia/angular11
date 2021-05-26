import { Component, ElementRef, OnInit, SimpleChanges, ViewChild, OnChanges, AfterViewInit, OnDestroy, Input, Renderer2, HostListener } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  constructor(private renderer: Renderer2) { }

  winWidth = 0;
  winHeight = 0;
  startX = 0;
  startY = 0;
  x = 0;
  y = 0;
  index = 1;

  imgWidth = 0;
  imgHeight = 0;
  imgMarginLeft = 0;
  imgMarginTop = 0;

  rotateNum = 0;
  rotateValue = '';
  scaleNum = 1;
  scaleValue = '';
  @Input() initialImage = '';

  mousemoveSub!: Subscription;
  mouseupSub!: Subscription;

  @ViewChild('imgViewContent') imgViewContent!: ElementRef;
  @ViewChild('imgViewDiv') imgViewDiv!: ElementRef;
  @ViewChild('dialogImg') dialogImg!: ElementRef;

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngAfterViewInit(): void {
    this.init();
  }

  init(): void {

    const image = new Image();
    image.src = this.initialImage;
    let { width, height } = image;
    const { clientWidth, clientHeight } = this.imgViewDiv.nativeElement;

    console.log(clientWidth, clientHeight);

    if (width < (clientWidth * 0.8) && height < (clientHeight * 0.8)) {
      width = width;
      height = height;
    } else {
      const scaleX = width / (clientWidth * 0.8);
      const scaleY = height / (clientHeight * 0.8);
      if (scaleX > scaleY) {
        width = Math.floor(clientWidth * 0.8);
        height = Math.floor(height / scaleX);
      } else {
        width = Math.floor(width / scaleY);
        height = Math.floor(clientHeight * 0.8);
      }
    }

    const left = (clientWidth - width) / 2;
    const top = (clientHeight - height) / 2;

    this.imgMarginLeft = left;
    this.imgMarginTop = top;
    this.imgWidth = width;
    this.imgHeight = height;

    this.imgViewContent.nativeElement.style.cssText = 'margin-top:' + top + 'px; margin-left:' + left + 'px';
    this.dialogImg.nativeElement.style.cssText = 'width:' + width + 'px; height:' + height + 'px;';
  }

  onRotate(): void {
    this.rotateNum++;
    this.rotateValue = this.rotateNum * 90 + 'deg';
  }

  onZoomIn(): void {
    this.scaleNum++;
    // this.scaleValue = this.scaleNum * 0.2 + 1;
  }

  mousedown(event: any): void {
    event.preventDefault();
    const imgWidth = this.imgWidth;
    const imgHeight = this.imgHeight;
    const rotateNum = this.rotateNum * 90;
    // 根据旋转的角度不同，坐标也不一样
    if (rotateNum % 90 === 0 && rotateNum % 180 !== 0 && rotateNum % 270 !== 0 && rotateNum % 360 !== 0) {
      this.startX = (imgWidth - imgHeight) / 2 + imgHeight - event.offsetY;
      this.startY = event.offsetX - (imgWidth - imgHeight) / 2;
    } else if (rotateNum % 180 === 0 && rotateNum % 360 !== 0) {
      this.startX = imgWidth - event.offsetX;
      this.startY = imgHeight - event.offsetY;
    } else if (rotateNum % 270 === 0 && rotateNum % 360 !== 0) {
      this.startX = (imgWidth - imgHeight) / 2 + event.offsetY;
      this.startY = imgWidth - event.offsetX - (imgWidth - imgHeight) / 2;
    } else {
      this.startX = event.offsetX;
      this.startY = event.offsetY;
    }

    this.mousemoveSub = fromEvent(document, 'mousemove').subscribe(this.mousemove.bind(this));
    // this.mouseupSub = fromEvent(document, 'mousemove').subscribe(this.mouseup.bind(this));
    // this.subscription.fromEvent('document', 'mouseup').subscribe(this.mouseup.bind(this));
    // document.addEventListener('mousemove', this.mousemove);
    // document.addEventListener('mouseup', this.mouseup);

  }

  // 拖拽
  mousemove(event: any): void {
    this.y = event.clientY - this.startY - 10;
    this.x = event.clientX - this.startX - 10;
    this.imgViewContent.nativeElement.style.marginTop = '' + this.y + 'px';
    this.imgViewContent.nativeElement.style.marginLeft = '' + this.x + 'px';
    this.imgViewContent.nativeElement.style.transition = 'margin 0s';
  }
  // 鼠标放开
  mouseup(): void {
    this.mousemoveSub.unsubscribe();
    this.mouseupSub.unsubscribe();
    // document.removeEventListener('mousemove', this.mousemove);
    // document.removeEventListener('mouseup', this.mouseup);
    this.imgViewContent.nativeElement.style.transition = 'all 0.6s';
  }
  // mouseMove(event: any): void {
  //   // const imgWidth = this.imgWidth;
  //   // const imgHeight = this.imgHeight;
  //   // const rotateNum = this.num * 90;
  //   // // 根据旋转的角度不同，坐标也不一样
  //   // if (rotateNum % 90 == 0 && rotateNum % 180 != 0 && rotateNum % 270 != 0 && rotateNum % 360 != 0) {
  //   //   this.startX = (imgWidth - imgHeight) / 2 + imgHeight - event.offsetY;
  //   //   this.startY = event.offsetX - (imgWidth - imgHeight) / 2;
  //   // } else if (rotateNum % 180 == 0 && rotateNum % 360 != 0) {
  //   //   this.startX = imgWidth - event.offsetX;
  //   //   this.startY = imgHeight - event.offsetY;
  //   // } else if (rotateNum % 270 == 0 && rotateNum % 360 != 0) {
  //   //   this.startX = (imgWidth - imgHeight) / 2 + event.offsetY;
  //   //   this.startY = imgWidth - event.offsetX - (imgWidth - imgHeight) / 2;
  //   // } else {
  //   //   this.startX = event.offsetX;
  //   //   this.startY = event.offsetY;
  //   // }
  //   // document.addEventListener('mousemove', mousemove);
  //   // document.addEventListener('mouseup', mouseup);
  //   // // 拖拽
  //   // function mousemove(event) {
  //   // console.log(event);
  //   // console.log(11110);
  //   // tslint:disable-next-line: no-shadowed-variable
  //   event.preventDefault();

  //   this.y = event.offsetY - this.startY - 10;
  //   this.x = event.offsetX - this.startX - 10;
  //   console.log('drag', event.offsetX, event.offsetY);
  //   this.imgViewContent.nativeElement.style.marginTop = '' + this.y + 'px';
  //   this.imgViewContent.nativeElement.style.marginLeft = '' + this.x + 'px';
  //   // this.imgViewContent.nativeElement.style.transition = 'margin 0s';

  //   // // 鼠标放开
  //   // function mouseup() {
  //   //   document.removeEventListener('mousemove', mousemove);
  //   //   document.removeEventListener('mouseup', mouseup);
  //   //   this.imgViewContent.style.transition = 'all 0.6s';
  //   // }
  // }

  // mouseDown(event: any): void {
  //   const imgWidth = this.imgWidth;
  //   const imgHeight = this.imgHeight;
  //   const rotateNum = this.num * 90;

  //   // 根据旋转的角度不同，坐标也不一样
  //   if (rotateNum % 90 === 0 && rotateNum % 180 !== 0 && rotateNum % 270 !== 0 && rotateNum % 360 !== 0) {
  //     this.startX = (imgWidth - imgHeight) / 2 + imgHeight - event.offsetY;
  //     this.startY = event.offsetX - (imgWidth - imgHeight) / 2;
  //   } else if (rotateNum % 180 === 0 && rotateNum % 360 !== 0) {
  //     this.startX = imgWidth - event.offsetX;
  //     this.startY = imgHeight - event.offsetY;
  //   } else if (rotateNum % 270 === 0 && rotateNum % 360 !== 0) {
  //     this.startX = (imgWidth - imgHeight) / 2 + event.offsetY;
  //     this.startY = imgWidth - event.offsetX - (imgWidth - imgHeight) / 2;
  //   } else {
  //     this.startX = event.offsetX;
  //     this.startY = event.offsetY;
  //   }
  //   console.log('start', event.offsetX, event.offsetY);

  //   // this.drag(event);
  // }
  // mouseUp(): void {
  //   this.imgViewContent.nativeElement.style.transition = 'all 0.6s';
  // }
  onClick(e: MouseEvent): void {
    console.log(e);
  }
}
