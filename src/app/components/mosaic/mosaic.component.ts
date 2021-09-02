import { Component, OnInit, OnChanges, AfterViewInit, OnDestroy, Input, ViewChild, ElementRef, SimpleChanges } from '@angular/core';

interface Data {
  data: any;
  width: number;
  height: number;
}

@Component({
  selector: 'app-mosaic',
  templateUrl: './mosaic.component.html',
  styleUrls: ['./mosaic.component.scss']
})
export class MosaicComponent implements OnInit, AfterViewInit {

  constructor() { }

  @ViewChild('imgViewContent') imgViewContent!: ElementRef;
  @ViewChild('canvas') canvasContainer!: ElementRef;

  @Input() initialImage = '';

  ctx: any;
  canvas: any;

  isMasic = false;

  image = new Image();

  beginX = 0;
  beginY = 0;
  endX = 0;
  endY = 0;
  squareEdgeLength = 1;

  tileWidth = 10;
  tileHeight = 10;

  oldImgdata!: Data;
  newImgdata!: Data;
  rect = {
    startX: 0,
    startY: 0,
    width: 0,
    heigh: 0
  };

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
    // this.image.crossOrigin = 'Anonymous';
    // this.image.onload = () => {
    //   this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);
    // };
    this.image.onload = () => {
      console.log(11);
      this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);
    };

  }

  onMouseDown(e: any): void {
    this.isMasic = true;
    this.rect.startX = e.offsetX;
    this.rect.startY = e.offsetY;
    // this.ctx.beginPath();

  }

  onMouseOut(): void {
    this.isMasic = false;
    // this.canvas.style.cursor = 'default';
  }

  onMouseUp(e: any): void {
    this.isMasic = false;
    // this.canvas.style.cursor = 'default';
    // this.endX = e.offsetX;
    // this.endY = e.offsetY;
    // if (this.isMasic) {
    //   this.ctx.rect(this.beginX, this.beginY, this.endX - this.beginX, this.endY - this.beginY);
    //   this.ctx.stroke();
    //   this.ctx.save();

    // }
    // this.ctx.clearRect(this.rect.startX, this.rect.startY, this.rect.width, this.rect.heigh);
    const size = 5;
    for (let i = 0;i < this.oldImgdata.width / size;i++) {
      for (let j = 0;j < this.oldImgdata.height / size;j++) {
        const color = this.getPxinfo(
          this.oldImgdata,
          i * size + (Math.floor(Math.random() * size)),
          j * size + (Math.floor(Math.random() * size))
        );
        for (let a = 0;a < size;a++) {
          for (let b = 0;b < size;b++) {
            this.setPxinfo(this.newImgdata, i * size + a, j * size + b, color);
          }
        }
      }
    }

    this.ctx.putImageData(this.newImgdata, this.rect.startX, this.rect.startY);
  }

  onMouseMove(e: any): void {
    this.endX = e.offsetX;
    this.endY = e.offsetY;
    if (this.isMasic) {
      this.rect.width = e.offsetX - this.rect.startX; // 获取矩形的width
      this.rect.heigh = e.offsetY - this.rect.startY; // 获取矩形的height
      this.oldImgdata = this.ctx.getImageData(this.rect.startX, this.rect.startY, this.rect.width, this.rect.heigh);
      this.newImgdata = this.ctx.createImageData(this.rect.width, this.rect.heigh);

      this.ctx.fillStyle = 'white';
      this.ctx.globalAlpha = .1;
      this.ctx.clearRect(this.rect.startX, this.rect.startY, this.rect.width - 1, this.rect.heigh - 1);
      this.ctx.rect(this.rect.startX, this.rect.startY, this.rect.width, this.rect.heigh);
      // this.ctx.restore();
      // this.ctx.save();
    }

  }

  drawRect(): void {
    this.ctx.fillRect(this.rect.startX, this.rect.startY, this.rect.width, this.rect.heigh);
  }

  getPxinfo(imgdata: Data, x: number, y: number): any[] {
    const color = [];
    const data = imgdata.data;
    const w = imgdata.width;
    const h = imgdata.height;
    color[0] = data[(y * w + x) * 4];
    color[1] = data[(y * w + x) * 4 + 1];
    color[2] = data[(y * w + x) * 4 + 2];
    color[3] = data[(y * w + x) * 4 + 3];
    return color;
  }
  setPxinfo(imgdata: Data, x: number, y: number, color: any[]): void {
    const data = imgdata.data;
    const w = imgdata.width;
    const h = imgdata.height;
    data[(y * w + x) * 4] = color[0];
    data[(y * w + x) * 4 + 1] = color[1];
    data[(y * w + x) * 4 + 2] = color[2];
    data[(y * w + x) * 4 + 3] = color[3];
  }
}
