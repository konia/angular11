import { Component, ElementRef, OnInit, SimpleChanges, ViewChild, OnChanges, AfterViewInit, OnDestroy, Input, Renderer2 } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

interface WindowToCanvas {
  x: number;
  y: number;
}
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  constructor() {

  }

  isMove = false;

  imgStatus = {
    scale: 1.0,
    rotate: 0
  };
  lastStatus = {
    imgX: 0,
    imgY: 0,
    mouseX: 0,
    mouseY: 0,
    translateX: 0,
    translateY: 0,
    scale: 1.0,
    rotate: 0
  };
  currentStatus = {};
  imgData: any;
  image = new Image();
  imgWidth = 0;
  imgHeight = 0;

  @Input() initialImage = '';

  ctx: any;
  canvas: any;

  @ViewChild('imgViewContent') imgViewContent!: ElementRef;
  @ViewChild('canvas') canvasContainer!: ElementRef;
  // @ViewChild('dialogImg') dialogImg!: ElementRef;

  config = {
    width: 0, // 设置canvas的宽
    height: 0, // 设置canvas的高
    maxScale: 4.0, // 最大放大倍数
    minScale: 0.1, // 最小放大倍数
    step: 0.1 // 每次放大、缩小 倍数的变化值
  };

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngAfterViewInit(): void {
    this.config.width = this.imgViewContent.nativeElement.clientWidth;
    this.config.height = this.imgViewContent.nativeElement.clientHeight;
    this.init();
  }

  init(): void {
    this.canvas = this.canvasContainer.nativeElement;
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;
    this.ctx = this.canvas.getContext('2d');
    this.image.src = this.initialImage;
    console.log(this.image.width);

    const { width, height } = this.image;
    const { width: clientWidth, height: clientHeight } = this.config;

    if (width < clientWidth && height < clientHeight) {
      this.imgWidth = width;
      this.imgHeight = height;
    } else {
      const scaleX = width / clientWidth;
      const scaleY = height / clientHeight;
      if (scaleX > scaleY) {
        this.imgWidth = Math.floor(clientWidth);
        this.imgHeight = Math.floor(height / scaleX);
      } else {
        this.imgWidth = Math.floor(width / scaleY);
        this.imgHeight = Math.floor(clientHeight);
      }
    }

    this.image.onload = () => {
      this.lastStatus = {
        imgX: (-1 * this.imgWidth) / 2,
        imgY: (-1 * this.imgHeight) / 2,
        mouseX: 0,
        mouseY: 0,
        translateX: this.canvas.width / 2,
        translateY: this.canvas.height / 2,
        scale: 1.0,
        rotate: 0

      };
      this.drawImgByStatus(this.canvas.width / 2, this.canvas.height / 2);
    };
  }

  drawImgByStatus(x: number, y: number): void {
    const imgX = this.lastStatus.imgX - (x - this.lastStatus.translateX) / this.lastStatus.scale;
    const imgY = this.lastStatus.imgY - (y - this.lastStatus.translateY) / this.lastStatus.scale;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate((this.imgStatus.rotate * Math.PI) / 180);
    this.ctx.scale(this.imgStatus.scale, this.imgStatus.scale);
    this.ctx.drawImage(this.image, imgX, imgY, this.imgWidth, this.imgHeight);
    this.ctx.restore();

    this.lastStatus.imgX = imgX;
    this.lastStatus.imgY = imgY;
    this.lastStatus.translateX = x;
    this.lastStatus.translateY = y;
    this.lastStatus.scale = this.imgStatus.scale;
    this.lastStatus.rotate = this.imgStatus.rotate;
    console.log(this.lastStatus);
  }

  drawImgByMove(x: number, y: number): void {
    this.lastStatus.translateX = this.lastStatus.translateX + (x - this.lastStatus.mouseX);
    this.lastStatus.translateY = this.lastStatus.translateY + (y - this.lastStatus.mouseY);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.lastStatus.translateX, this.lastStatus.translateY);
    this.ctx.rotate((this.imgStatus.rotate * Math.PI) / 180);
    this.ctx.scale(this.imgStatus.scale, this.imgStatus.scale);
    this.ctx.drawImage(this.image, this.lastStatus.imgX, this.lastStatus.imgY, this.imgWidth, this.imgHeight);
    this.ctx.restore();

    this.lastStatus.mouseX = x;
    this.lastStatus.mouseY = y;
  }

  onZoomIn(): void {
    this.imgStatus.scale = this.imgStatus.scale >= this.config.maxScale ? this.config.maxScale : this.imgStatus.scale + this.config.step;
    this.drawImgByStatus(this.canvas.width / 2, this.canvas.height / 2);
  }

  onZoomOut(): void {
    this.imgStatus.scale = this.imgStatus.scale <= this.config.minScale ? this.config.minScale : this.imgStatus.scale - this.config.step;
    this.drawImgByStatus(this.canvas.width / 2, this.canvas.height / 2);
  }

  onRotate(): void {
    const rotate = Math.floor(this.imgStatus.rotate / 90) * 90 - 90;
    this.imgStatus.rotate = rotate;
    this.drawImgByStatus(this.canvas.width / 2, this.canvas.height / 2);
  }

  onMouseDown(e: any): void {
    this.isMove = true;
    this.canvas.style.cursor = 'move';

    const { x, y } = this.windowToCanvas(e.clientX, e.clientY);
    this.lastStatus.mouseX = x;
    this.lastStatus.mouseY = y;
  }

  onMouseOut(): void {
    this.isMove = false;
    this.canvas.style.cursor = 'default';
  }

  onMouseUp(): void {
    this.isMove = false;
    this.canvas.style.cursor = 'default';
  }

  onMouseMove(e: any): void {
    if (this.isMove) {
      const { x, y } = this.windowToCanvas(e.clientX, e.clientY);
      this.drawImgByMove(x, y);
    }
  }

  onLighten(): void {
    this.imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0;i < this.imgData.data.length;i += 4) {
      const x = 20;
      this.imgData.data[i + 0] += x;
      this.imgData.data[i + 1] += x;
      this.imgData.data[i + 2] += x;
    }
    this.ctx.putImageData(this.imgData, 0, 0);
  }
  onDarken(): void {
    this.imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0;i < this.imgData.data.length;i += 4) {
      const x = 20;
      this.imgData.data[i + 0] -= x;
      this.imgData.data[i + 1] -= x;
      this.imgData.data[i + 2] -= x;
    }
    this.ctx.putImageData(this.imgData, 0, 0);
  }

  // 计算相对于canvas左上角的坐标值
  windowToCanvas(x: number, y: number): WindowToCanvas {
    const box = this.canvas.getBoundingClientRect();
    return {
      x: x - box.left,
      y: y - box.top
    };
  }
}
