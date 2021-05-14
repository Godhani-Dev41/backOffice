import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'rc-action-success-modal',
  templateUrl: './action-success-modal.component.html',
  styleUrls: ['./action-success-modal.component.scss'],
  exportAs: 'modal'
})
export class ActionSuccessModalComponent implements OnInit {
  @Input() subTitleText: string;
  @Input() titleText: string;
  @Input() successBtnText: string;
  @Input() cancelText: string;

  @Output() onSuccessClick = new EventEmitter();
  @Output() onCancelClick = new EventEmitter();

  @ViewChild('modal', { static: true }) public modal: ModalDirective;
  constructor() { }

  showModal() {
    this.modal.show();
  }

  ngOnInit() {
  }

}
