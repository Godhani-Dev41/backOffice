import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'rc-loading-btn',
  templateUrl: './loading-btn.component.html',
  styleUrls: ['./loading-btn.component.scss']
})
export class LoadingBtnComponent implements OnInit, OnChanges {
  @Input() text: string;
  @Input() classes: string[];
  @Input() loading: boolean;
  @Input() disabled: boolean;
  @Input() loadingText: string;
  @Output() onClick = new EventEmitter();

  constructor() {

  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loading'] && this.loading) {
      this.disabled = true;
    } else if (this.loading === false) {
      this.disabled = false;
    }
  }

  clicked() {
    if (this.disabled) return;

    this.onClick.emit();
  }
}
