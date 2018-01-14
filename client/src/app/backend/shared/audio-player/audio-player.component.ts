import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Input
} from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.less']
})
export class AudioPlayerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('audioObj') audioObj: ElementRef;
  @ViewChild('playObj') playObj: ElementRef;
  @ViewChild('controlsObj') controlsObj: ElementRef;
  @ViewChild('progress') progress: ElementRef;
  @ViewChild('precache') precache: ElementRef;
  @Input() fileSrc: string;
  pt;
  pc;

  constructor() {}

  ngAfterViewInit() {
    this.pt = this.playObj.nativeElement.createSVGPoint();
    this.pc = 298.1371428256714; // 2 pi r
    this.audioObj.nativeElement.setAttribute(
      'src',
      this.fileSrc + '?' + Math.random()
    );
    this.audioObj.nativeElement.addEventListener(
      'progress',
      this.progressListener.bind(this)
    );
    // this.controlListener('not-started');
  }

  ngOnDestroy() {
    this.audioObj.nativeElement.removeEventListener(
      'timeupdate',
      this.reportPosition.bind(this)
    );
    this.precache.nativeElement.removeEventListener(
      'mousedown',
      this.reportPosition.bind(this)
    );
  }

  cursorPoint(evt) {
    this.pt.x = evt.clientX;
    this.pt.y = evt.clientY;
    return this.pt.matrixTransform(
      this.playObj.nativeElement.getScreenCTM().inverse()
    );
  }

  angle(ex, ey) {
    const dy = ey - 50; // 100;
    const dx = ex - 50; // 100;
    let theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    theta = theta + 90; // in our case we are animating from the top, so we offset by the rotation value;
    if (theta < 0) {
      theta = 360 + theta;
    } // range [0, 360)
    return theta;
  }

  setGraphValue(obj, val) {
    const val1 = this.pc - val / this.audioObj.nativeElement.duration * this.pc;
    obj.style.strokeDashoffset = val1;
    if (val1 === 0) {
      obj.classList.add('done');
      if (obj === this.progress.nativeElement) {
        this.playObj.nativeElement.className = 'ended';
      }
    }
  }
  progressListener(event) {
    if (this.audioObj.nativeElement.buffered.length > 0) {
      const end = this.audioObj.nativeElement.buffered.end(
        this.audioObj.nativeElement.buffered.length - 1
      );
      this.setGraphValue(this.precache.nativeElement, end);
    }
  }
  reportPosition() {
    this.setGraphValue(
      this.progress.nativeElement,
      this.audioObj.nativeElement.currentTime
    );
  }
  positionListener(event) {
    //   console.log('a',Math.sqrt((pc-loc.x)*(pc-loc.x) + (pc-loc.y)*    (pc-loc.y)));
    const loc = this.cursorPoint(event),
      deg = this.angle(loc.x, loc.y) / 360,
      pct = this.pc * deg;
    console.log(loc, deg);
    // doo doo doo don't mind me, this code does nothing yet ...
  }

  // idea:
  // use polar co ordinate conversion and convert the position as a percentage of 360 degrees... and draw it as an arc rather than a circle
  // rather than extending the length of the dash
  // http://stackoverflow.com/a/24569190/1238884
  controlListener(event) {
    switch (this.playObj.nativeElement.getAttribute('class')) {
      case 'not-started':
        this.audioObj.nativeElement.addEventListener(
          'timeupdate',
          this.reportPosition.bind(this)
        );
        this.precache.nativeElement.addEventListener(
          'mousedown',
          this.positionListener.bind(this),
          false
        );
        this.audioObj.nativeElement.play();
        this.playObj.nativeElement.setAttribute('class', 'playing');
        break;
      case 'playing':
        this.playObj.nativeElement.setAttribute('class', 'paused');
        this.audioObj.nativeElement.pause();
        break;
      case 'paused':
        this.playObj.nativeElement.setAttribute('class', 'playing');
        this.audioObj.nativeElement.play();
        break;
      case 'ended':
        this.playObj.nativeElement.setAttribute('class', 'not-started');
        this.audioObj.nativeElement.removeEventListener(
          'timeupdate',
          this.reportPosition.bind(this)
        );
        break;
    }
  }
}
