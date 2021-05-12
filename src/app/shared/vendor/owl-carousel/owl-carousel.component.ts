import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  Input,
  IterableDiffer,
  IterableDiffers,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { OwlChildComponent } from './owl-child.component';

@Component({
  selector: 'rc-owl-carousel',
  styleUrls: ['./assets/owl.carousel.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <rc-owl-carousel-child *ngIf="show" #owl [ngClass]="carouselClasses" [options]="options">
        <ng-content></ng-content>
    </rc-owl-carousel-child>
`
})
export class OwlCarouselComponent implements DoCheck {
  @ViewChild('owl', { static: false }) $owlChild: OwlChildComponent;
  @Input('carouselClasses') carouselClasses: any = '';
  @Input('options') options: any = {};
  private _items: any;
  private differ: IterableDiffer<any>;
  show = true;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private differs: IterableDiffers
  ) {

  }

  @Input() set items(coll: any[]) {
    this._items = coll;
    if (coll && !this.differ) {
      this.differ = this.differs.find(coll).create(null);
    }
  }

  ngDoCheck() {
    if (this.differ) {
      const changes = this.differ.diff(this._items);
      if (changes) {
        let changed = false;
        const changedFn = () => {
          changed = true;
        };
        changes.forEachAddedItem(changedFn);
        changes.forEachMovedItem(changedFn);
        changes.forEachRemovedItem(changedFn);

        if (changed) {
          this.refresh();
        }
      }
    }
  }

  refresh() {
    this.show = false;
    setTimeout(() => {
      this.show = true;
    }, 0);
  }

  next(options?: any[]) {
    this.trigger('next.owl.carousel', options);
  }

  previous(options?: any[]) {
    this.trigger('prev.owl.carousel', options);
  }

  to(options?: any[]) {
    this.trigger('to.owl.carousel', options);
  }

  trigger(action: string, options?: any[]) {
    this.$owlChild.trigger(action, options);
  }
}
