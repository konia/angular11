import { Component, ElementRef, OnInit, SimpleChanges, ViewChild, OnChanges, AfterViewInit, OnDestroy, Input } from '@angular/core';
const ImageEditor = require('tui-image-editor');

import { ImageSize } from './interface/image-size';
import { isFileApiSupported } from './utils';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  imageEditor: any;
  initializeImgUrl!: string;
  imageChosen = false;

  @Input() initialImage!: string;

  @Input() options: {
    usageStatistics: boolean;
    selectionStyle?: {
      cornerStyle: string;
      cornerSize: number;
      cornerColor: string;
      cornerStrokeColor: string;
      transparentCorners: boolean;
      lineWidth: number;
      borderColor: string;
      rotatingPointOffset: number;
    };
    applyCropSelectionStyle: boolean;
    applyGroupSelectionStyle: boolean;
  } = {
      usageStatistics: false,
      selectionStyle: {
        cornerStyle: 'circle',
        cornerSize: 32,
        cornerColor: '#fff',
        cornerStrokeColor: '#fff',
        transparentCorners: false,
        lineWidth: 4,
        borderColor: '#fff',
        rotatingPointOffset: 500,
      },
      applyCropSelectionStyle: true,
      applyGroupSelectionStyle: true,
    };

  @ViewChild('imageContainer') imageContainer!: ElementRef;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes.options && changes.options.firstChange === false) ||
      (changes.initialImage && changes.initialImage.firstChange === false)
    ) {
      // this.destroyImageEditor();
      this.initializeImageEditor();
    }
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngAfterViewInit(): void {
    const that = this;

    setTimeout(() => {
      //   this.imageEditor.on(eventNames.SELECTION_CLEARED, function () {
      //     that.activeObjectId = null;
      //     if (that.submenu === 'text') {
      //       that.imageEditor.changeCursor('text');
      //     } else if (that.submenu !== 'draw' && that.submenu !== 'crop') {
      //       that.imageEditor.stopDrawingMode();
      //     }
      //   });
      that.initializeImageEditor();
    });
  }

  initializeImageEditor(): void {
    // this.historyService.clear();

    this.imageEditor = new ImageEditor(
      this.imageContainer.nativeElement,
      this.options
    );
    console.log(this.imageEditor);
    if (this.initialImage != null) {
      this.loadImage(this.initialImage);
    }
  }

  loadImage(file: string): void {
    console.log(file);
    if (file != null) {
      if (this.initializeImgUrl != null && file !== this.initializeImgUrl) {
        URL.revokeObjectURL(this.initializeImgUrl);
      }

      this.initializeImgUrl = file;
      this.imageEditor
        .loadImageFromURL(this.initializeImgUrl, 'RandomFileName')
        .then((sizeValue: ImageSize) => {
          this.imageChosen = true;

          // this.exitCropOnAction();
          this.imageEditor.clearUndoStack();
          this.imageEditor.clearRedoStack();
          // this.historyService.clear();
          // this.imageEditor._invoker.fire(
          //   eventNames.EXECUTE_COMMAND,
          //   historyNames.LOAD_IMAGE
          // );
        }).catch((message: any) => Promise.reject(message));
    }
  }
  aaa(): void {
    console.log(1111);
  }
  getImage(): string {

    const options: {
      format: 'jpeg' | 'png';
      quality: number;
      multiplier: number;
      left?: number;
      top?: number;
      width?: number;
      height?: number;
    } = {
      format: 'png',
      quality: 1,
      multiplier: 1,
      width: 100,
      height: 100
    };
    if (this.imageChosen) {
      console.log(this.imageEditor.toDataURL(options));
      return this.imageEditor.toDataURL(options);
    }

    return '';
  }
}
