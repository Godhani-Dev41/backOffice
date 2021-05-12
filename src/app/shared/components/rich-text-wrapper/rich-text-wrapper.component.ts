import React from "react";
import ReactDOM from "react-dom";
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { RichText } from "@app/react/components/shared/RichText";

@Component({
  selector: "rc-rich-text-wrapper",
  template: `<div #reactRoot></div>`,
  encapsulation: ViewEncapsulation.Emulated,
})
export class RichTextWrapperComponent implements OnDestroy, AfterViewInit {
  @ViewChild("reactRoot", { static: true }) containerRef: ElementRef;

  @Input() initialValue: string;
  @Input() max: number;
  @Output() handleChange = new EventEmitter<string>();
  @Output() setDescLength = new EventEmitter<number>();

  constructor() {}

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
  }

  ngAfterViewInit() {
    this.render(this.initialValue, this.max);
  }

  onHandleChange(newValue: string) {
    this.handleChange.emit(newValue);
  }

  onSetLength(newNumber: number) {
    this.setDescLength.emit(newNumber);
  }

  private render(initialValue, max) {
    if (!this.containerRef) return;
    ReactDOM.render(
      React.createElement(RichText, {
        initialValue: initialValue,
        handleChange: (newValue: string) => this.onHandleChange(newValue),
        setLength: (newNumber: number) => this.onSetLength(newNumber),
        max: max,
      }),
      this.containerRef.nativeElement,
    );
  }
}
