import { Directive, ElementRef, Input, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[rcImageUploadPreview]'
})
export class ImageUploadPreviewDirective implements OnChanges {
  @Input() image: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {

  }

  ngOnChanges(changes: SimpleChanges) {
    const reader = new FileReader();
    const el = this.el;

    reader.onloadend = function (e) {
      el.nativeElement.style.backgroundImage = `url(${reader.result})`;
    };

    if (this.image) {
      return reader.readAsDataURL(this.image);
    }
  }
}
