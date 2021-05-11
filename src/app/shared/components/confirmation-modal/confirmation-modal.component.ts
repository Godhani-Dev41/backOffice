import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'rc-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  exportAs: 'modal'
})
export class ConfirmationModalComponent implements OnInit {
  @ViewChild('modal') public modal: ModalDirective;
  @Input() type: 'success' | 'danger' = 'success';
  @Input() title: string;
  @Input() content: string;
  @Input() confirmText = 'Yes';
  @Output() onConfirm = new EventEmitter<any>();
  data: any;
  constructor() { }

  ngOnInit() {
  }

  confirm() {
    this.onConfirm.emit(this.data);
    this.modal.hide();
  }

  showModal(data?: any) {
    this.data = data;
    this.modal.show();
  }

}
