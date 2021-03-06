/* tslint:disable */
import { ElementRef, OnChanges, SimpleChanges, Input, EventEmitter, Output, Component, OnInit } from '@angular/core';
import 'ion-rangeslider';

import * as jQuery from 'jquery';

@Component({
  selector: 'rc-ion-range-slider',
  template: `<input type="text" value="" />`
})
export class IonRangeSliderComponent implements OnChanges, OnInit {

  @Input() private min: any;
  @Input() private max: any;
  @Input() private from: any;
  @Input() private to: any;
  @Input() private disable: any;

  @Input() private type: any;
  @Input() private step: any;
  @Input() private min_interval: any;
  @Input() private max_interval: any;
  @Input() private drag_interval: any;
  @Input() private values: any;
  @Input() private from_fixed: any;
  @Input() private from_min: any;
  @Input() private from_max: any;
  @Input() private from_shadow: any;
  @Input() private to_fixed: any;
  @Input() private to_min: any;
  @Input() private to_max: any;
  @Input() private to_shadow: any;
  @Input() private prettify_enabled: any;
  @Input() private prettify_separator: any;
  @Input() private force_edges: any;
  @Input() private keyboard: any;
  @Input() private keyboard_step: any;
  @Input() private grid: any;
  @Input() private grid_margin: any;
  @Input() private grid_num: any;
  @Input() private grid_snap: any;
  @Input() private hide_min_max: any;
  @Input() private hide_from_to: any;
  @Input() private prefix: any;
  @Input() private postfix: any;
  @Input() private max_postfix: any;
  @Input() private decorate_both: any;
  @Input() private values_separator: any;
  @Input() private input_values_separator: any;

  @Input() private prettify: Function;

  @Output() onStart: EventEmitter<IonRangeSliderCallback> = new EventEmitter<IonRangeSliderCallback>();
  @Output() onChange: EventEmitter<IonRangeSliderCallback> = new EventEmitter<IonRangeSliderCallback>();
  @Output() onFinish: EventEmitter<IonRangeSliderCallback> = new EventEmitter<IonRangeSliderCallback>();
  @Output() onUpdate: EventEmitter<IonRangeSliderCallback> = new EventEmitter<IonRangeSliderCallback>();

  private el: ElementRef;
  private inputElem: any;
  private initialized = false;

  private from_percent: number;
  private from_value: number;
  private to_percent: number;
  private to_value: number;

  constructor(el: ElementRef) {
    this.el = el;
  }

  ngOnInit() {
    this.inputElem = this.el.nativeElement.getElementsByTagName('input')[0];
    this.initSlider();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized) {
      //
      for (const propName in changes) {
        const update = {};
        update[propName] = changes[propName].currentValue;
        jQuery(this.inputElem).data('ionRangeSlider').update(update);
      }
    }
  }

  update(data) {
    jQuery(this.inputElem).data('ionRangeSlider').update(data);
  }

  restore() {
    jQuery(this.inputElem).data('ionRangeSlider').restore();
  }

  destroy() {
    jQuery(this.inputElem).data('ionRangeSlider').destroy();
  }

  private initSlider() {
    const that = this;
    jQuery(this.inputElem)['ionRangeSlider']({
      min: that.min,
      max: that.max,
      from: that.from,
      to: that.to,
      disable: this.toBoolean(that.disable),

      type: that.type,
      step: that.step,
      min_interval: that.min_interval,
      max_interval: that.max_interval,
      drag_interval: that.drag_interval,
      values: that.values,
      from_fixed: this.toBoolean(that.from_fixed),
      from_min: that.from_min,
      from_max: that.from_max,
      from_shadow: this.toBoolean(that.from_shadow),
      to_fixed: this.toBoolean(that.to_fixed),
      to_min: that.to_min,
      to_max: that.to_max,
      to_shadow: this.toBoolean(that.to_shadow),
      prettify_enabled: this.toBoolean(that.prettify_enabled),
      prettify_separator: that.prettify_separator,
      force_edges: this.toBoolean(that.force_edges),
      keyboard: this.toBoolean(that.keyboard),
      keyboard_step: that.keyboard_step,
      grid: this.toBoolean(that.grid),
      grid_margin: this.toBoolean(that.grid_margin),
      grid_num: that.grid_num,
      grid_snap: this.toBoolean(that.grid_snap),
      hide_min_max: this.toBoolean(that.hide_min_max),
      hide_from_to: this.toBoolean(that.hide_from_to),
      prefix: that.prefix,
      postfix: that.postfix,
      max_postfix: that.max_postfix,
      decorate_both: this.toBoolean(that.decorate_both),
      values_separator: that.values_separator,
      input_values_separator: that.input_values_separator,

      prettify: that.prettify,

      onStart: function () {
        that.onStart.emit(that.buildCallback());
      },
      onChange: function (a) {
        that.updateInternalValues(a);
        that.onChange.emit(that.buildCallback());
      },
      onFinish: function () {
        that.onFinish.emit(that.buildCallback());
      },
      onUpdate: function () {
        that.onUpdate.emit(that.buildCallback());
      }
    });
    this.initialized = true;
  }

  private toBoolean(value) {
    if (value && typeof value === 'string') {
      return value.toLowerCase() !== 'false';
    } else {
      return value;
    }
  }

  private updateInternalValues(data: IonRangeSliderCallback) {
    this.min = data.min;
    this.max = data.max;
    this.from = data.from;
    this.from_percent = data.from_percent;
    this.from_value = data.from_value;
    this.to = data.to;
    this.to_percent = data.to_percent;
    this.to_value = data.to_value;
  }

  private buildCallback(): IonRangeSliderCallback {
    const callback = new IonRangeSliderCallback();
    callback.min = this.min;
    callback.max = this.max;
    callback.from = this.from;
    callback.from_percent = this.from_percent;
    callback.from_value = this.from_value;
    callback.to = this.to;
    callback.to_percent = this.to_percent;
    callback.to_value = this.to_value;
    return callback;
  }
}

export class IonRangeSliderCallback {
  min: any;               // MIN value
  max: any;               // MAX value
  from: number;           // FROM value (left or single handle)
  from_percent: number;   // FROM value in percents
  from_value: number;     // FROM index in values array (if used)
  to: number;             // TO value (right handle in double type)
  to_percent: number;     // TO value in percents
  to_value: number;       // TO index in values array (if used)
}
