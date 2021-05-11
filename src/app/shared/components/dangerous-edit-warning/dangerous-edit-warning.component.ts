import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd";

@Component({
  selector: "rc-dangerous-edit-warning",
  templateUrl: "./dangerous-edit-warning.component.html",
  styleUrls: ["./dangerous-edit-warning.component.scss"],
})
export class DangerousEditWarningComponent implements OnInit {
  @Output() accepted = new EventEmitter<boolean>();
  confirmModal: NzModalRef;

  constructor(private modal: NzModalService) {}

  ngOnInit() {
    this.confirmModal = this.modal.confirm({
      nzTitle: "Do you want to edit this season?",
      nzContent:
        "If you edit this season, all product and space allocations will be removed and you must add them again manually",
      nzOnOk: () => {
        this.accepted.emit(true);
        this.confirmModal.close();
      },
    });
  }

  open() {
    this.confirmModal.open();
  }
}
