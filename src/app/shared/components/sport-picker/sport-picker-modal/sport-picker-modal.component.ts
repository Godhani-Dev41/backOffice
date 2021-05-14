import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RCSportItem, SportsService } from '@app/shared/services/utils/sports.service';

@Component({
  selector: 'rc-sport-picker-modal',
  templateUrl: './sport-picker-modal.component.html',
  styleUrls: ['./sport-picker-modal.component.scss'],
  exportAs: 'modal'
})
export class SportPickerModalComponent implements OnInit {
  @ViewChild('modal', { static: true }) public modal: ModalDirective;
  @Output() onSelect = new EventEmitter<RCSportItem[]>();
  @Input() sports: RCSportItem[];
  @Input() singleSelect: boolean;
  constructor(
    private sportsService: SportsService
  ) { }

  ngOnInit() {
    this.sports = this.sports || this.sportsService.getSports();
  }

  showModal() {
    this.modal.show();
  }

  submit() {
    const selected = this.sports.filter(i => i.active);

    this.onSelect.emit(selected);
    this.modal.hide();
  }

  sportSelect(sport: RCSportItem) {
    if (this.singleSelect) {
      this.sports.forEach(i => i.active = false);
    }

    sport.active = !sport.active;
  }
}
