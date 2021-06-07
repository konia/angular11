import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

interface WindowToCanvas {
  x: number;
  y: number;
}

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit, AfterViewInit {

  constructor() { }

  @ViewChild('imgViewContent') imgViewContent!: ElementRef;
  @ViewChild('canvas') canvasContainer!: ElementRef;

  @Input() initialImage = '';

  ctx: any;
  canvas: any;

  isMove = false;

  config = {
    width: 0, // 设置canvas的宽
    height: 0, // 设置canvas的高
    maxScale: 4.0, // 最大放大倍数
    minScale: 0.1, // 最小放大倍数
    step: 0.1, // 每次放大、缩小 倍数的变化值
    scale: 1.0,
    rotate: 0
  };
  cssStyle = {
    rotate: '',
    scale: '',
    translate: ''
  };

  imgStatus = {
    scale: 1.0,
    rotate: 0
  };

  lastStatus = {
    mouseX: 0,
    mouseY: 0,
    translateX: 0,
    translateY: 0,

  };

  image = new Image();

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.init();
  }

  init(): void {

    this.canvas = this.canvasContainer.nativeElement;
    this.image.src = this.initialImage;
    this.canvas.width = this.image.width;
    this.canvas.height = this.image.height;
    this.ctx = this.canvas.getContext('2d');
    console.log(this.image);
    this.image.onload = () => {
      this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);
    };
    // this.ctx.save();

  }

  drawImgByMove(x: number, y: number): void {
    this.lastStatus.translateX = this.lastStatus.translateX + (x - this.lastStatus.mouseX);
    this.lastStatus.translateY = this.lastStatus.translateY + (y - this.lastStatus.mouseY);
    this.cssStyle.translate = 'translate(' + this.lastStatus.translateX + 'px, ' + this.lastStatus.translateY + 'px)';
    this.lastStatus.mouseX = x;
    this.lastStatus.mouseY = y;
    setTimeout(() => {
      this.canvas.style.cssText = `transform: ${this.cssStyle.translate} ${this.cssStyle.scale} ${this.cssStyle.rotate}`;
    }, 0);
    // console.log(this.cssStyle.translate);
    // this.canvas.style.cssText = `transform: ${this.cssStyle.translate} ${this.cssStyle.scale} ${this.cssStyle.rotate}`;

    // console.log(this.lastStatus);

  }

  onZoomIn(): void {
    this.imgStatus.scale = this.imgStatus.scale >= this.config.maxScale ? this.config.maxScale : this.imgStatus.scale + this.config.step;
    this.cssStyle.scale = 'scale(' + this.imgStatus.scale + ')';
    this.canvas.style.cssText = `transform: ${this.cssStyle.translate} ${this.cssStyle.scale} ${this.cssStyle.rotate}`;
  }

  onZoomOut(): void {
    this.imgStatus.scale = this.imgStatus.scale <= this.config.minScale ? this.config.minScale : this.imgStatus.scale - this.config.step;
    this.cssStyle.scale = 'scale(' + this.imgStatus.scale + ')';
    this.canvas.style.cssText = `transform: ${this.cssStyle.translate} ${this.cssStyle.scale} ${this.cssStyle.rotate}`;
  }

  onRotate(): void {
    const rotate = Math.floor(this.imgStatus.rotate / 90) * 90 - 90;
    this.imgStatus.rotate = rotate;
    this.cssStyle.rotate = 'rotate(' + this.imgStatus.rotate + 'deg)';
    this.canvas.style.cssText = `transform: ${this.cssStyle.translate} ${this.cssStyle.scale} ${this.cssStyle.rotate}`;
  }

  onMouseDown(e: any): void {
    this.isMove = true;
    // this.canvas.style.cursor = 'move';

    // const { x, y } = this.windowToCanvas(e.clientX, e.clientY);

    this.lastStatus.mouseX = e.clientX;
    this.lastStatus.mouseY = e.clientY;
    console.log(e.clientX, e.clientY);
  }

  onMouseOut(): void {
    this.isMove = false;
    // this.canvas.style.cursor = 'default';
  }

  onMouseUp(): void {
    this.isMove = false;
    // this.canvas.style.cursor = 'default';
  }

  onMouseMove(e: any): void {
    if (this.isMove) {
      const { x, y } = this.windowToCanvas(e.clientX, e.clientY);
      // console.log(x, y);
      this.drawImgByMove(e.clientX, e.clientY);
    }
  }

  onLighten(): void {
    const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0;i < imgData.data.length;i += 4) {
      const x = 20;
      imgData.data[i + 0] += x;
      imgData.data[i + 1] += x;
      imgData.data[i + 2] += x;
    }
    this.ctx.putImageData(imgData, 0, 0);
  }
  onDarken(): void {

  }

  // 计算相对于canvas左上角的坐标值
  windowToCanvas(x: number, y: number): WindowToCanvas {
    const box = this.canvas.getBoundingClientRect();
    console.log(box.left, box.top);
    return {
      x: x - box.left,
      y: y - box.top
    };
  }
}
