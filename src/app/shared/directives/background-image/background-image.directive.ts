import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MediaUrlPipe } from '@app/shared/pipes/media-url.pipe';
import { RCMediaObject } from '@rcenter/core';

@Directive({
  selector: '[rcBackgroundImage]'
})
export class BackgroundImageDirective implements OnChanges {
  @Input() rcBackgroundImage: string | RCMediaObject;
  @Input() rcBackgroundDefaultType: 'user';
  constructor(private el: ElementRef, private mediaUrlPipe: MediaUrlPipe) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rcBackgroundImage']) {
      this.changeBackgroundImage();
    }
  }

  changeBackgroundImage() {
    let url: string = this.mediaUrlPipe.transform(this.rcBackgroundImage);
    if (url) {
      if (this.rcBackgroundDefaultType === 'user' && !url) url = 'assets/img/profile-pic-male.png';
      this.el.nativeElement.style.backgroundImage = 'url("' + url.replace(/"/g, '\\"') + '")';
    }
  }
}
