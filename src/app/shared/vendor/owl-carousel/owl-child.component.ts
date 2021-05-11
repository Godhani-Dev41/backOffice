import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnDestroy } from '@angular/core';
declare let $: any;
declare const jQuery: any;

@Component({
  selector: 'rc-owl-carousel-child',
  template: '<ng-content></ng-content>'
})
export class OwlChildComponent  implements OnDestroy, AfterViewInit {
  @HostBinding('class.owl-carousel') owlClass = true;
  $owl: any;
  @Input() options: any = {};

  constructor(private el: ElementRef) {
    $ = $ || jQuery;
  }

  ngAfterViewInit() {
    this.$owl = $(this.el.nativeElement).owlCarousel(this.options);
  }

  trigger(action: string, options?: any[]) {
    this.$owl.trigger(action, options);
  }

  ngOnDestroy() {
    this.$owl.trigger('destroy.owl.carousel').removeClass('owl-loaded');
    delete this.$owl;
  }
}
