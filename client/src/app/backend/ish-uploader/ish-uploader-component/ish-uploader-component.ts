import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  ViewChild,
  TemplateRef,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { IshUploaderService } from '../ish-uploader.service';
import { IFlow, IFlowFile } from 'flowjs';
import { IshFile } from '../ish-file';
const MODES = { SINGLE: 'single', MULTIPLE: 'multiple' };

@Component({
  selector: 'app-ishuploader',
  templateUrl: './ish-uploader-component.html',
  styleUrls: ['./ish-uploader-component.less']
})
export class IshUploaderComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChild(MODES.SINGLE) singleTmpl: TemplateRef<any>;
  @ViewChild(MODES.MULTIPLE) multipleTmpl: TemplateRef<any>;
  @ViewChild('ishFileSelector') btn: ElementRef;
  @ViewChild('ishDropSelector') dropZone: ElementRef;

  @Input() mode: String = 'single';
  @Output() onComplete: EventEmitter<any> = new EventEmitter();
  @Output() onError: EventEmitter<any> = new EventEmitter();
  public flow: IFlow;
  isLoading: Boolean = false;
  files: IshFile[] = [];

  constructor(private uploader: IshUploaderService) {}

  ngOnInit() {
    this.initializeUploader();
  }

  ngAfterViewInit() {
    if (this.mode === MODES.SINGLE) {
      this.flow.assignBrowse(this.btn.nativeElement, false, false, {
        accept: 'audio/*'
      });
    } else {
      this.flow.assignBrowse(this.dropZone.nativeElement, false, false, {
        accept: 'audio/*'
      });
    }
    this.flow.on(
      'fileAdded',
      function(file, event) {
        this.isLoading = true;
        const fileObj = Object.assign(<IshFile>file, {isUploaded: true});
        this.files.push(fileObj);
      }.bind(this)
    );

    this.flow.on(
      'fileRemoved',
      function(file) {
        this.isLoading = this.getFiles().length > 0;
        this.files.splice(this.files.indexOf(<IshFile>file), 1);
      }.bind(this)
    );

    this.flow.on(
      'filesSubmitted',
      function(file) {
        this.flow.upload();
      }.bind(this)
    );

    this.flow.on(
      'complete',
      function() {
        this.onComplete.emit({files: this.getFiles()});
      }.bind(this)
    );

    this.flow.on(
      'fileSuccess',
      function(file, message) {
        this.files = this.files.filter(
          fileObj =>
            fileObj.uniqueIdentifier === file.uniqueIdentifier
              ? { ...fileObj, isUploaded: true }
              : fileObj
        );
      }.bind(this)
    );
  }

  ngOnDestroy() {
    this.flow.off();
    if (this.mode === MODES.MULTIPLE) {
      this.flow.unAssignDrop([this.dropZone.nativeElement]);
    }
  }

  ngAfterViewChecked() {
    if (!this.isLoading) {
      if (this.mode === MODES.SINGLE) {
        this.flow.assignBrowse(this.btn.nativeElement, false, false, {
          accept: 'audio/*'
        });
      } else {
        this.flow.assignBrowse(this.dropZone.nativeElement, false, false, {
          accept: 'audio/*'
        });
      }
    }
  }

  initializeUploader() {
    this.flow = this.uploader.getFlowObject();
    const newOpts = { singleFile: this.mode === MODES.SINGLE };
    this.flow.opts = Object.assign(this.flow.opts, newOpts);
  }

  isUploading(): boolean {
    return this.flow.isUploading();
  }

  getTemplate() {
    return this.mode === MODES.SINGLE ? this.singleTmpl : this.multipleTmpl;
  }

  getFiles(): IFlowFile[] {
    return this.flow.files;
  }
}
