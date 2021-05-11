import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RCVenue } from '@rcenter/core';
import { RCParsedAddress } from '@app/shared/services/utils/location.service';

@Component({
  selector: 'rc-venue-select-modal',
  templateUrl: './venue-select-modal.component.html',
  styleUrls: ['./venue-select-modal.component.scss'],
  exportAs: 'modal'
})
export class VenueSelectModalComponent implements OnInit {
  @ViewChild('modal') public modal: ModalDirective;
  @Output() onSubmit = new EventEmitter();

  matchForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.matchForm = this.fb.group({
      address: '',
      venueName: ['', Validators.required],
      venueId: '',
      venue: ''
    });
  }

  showModal() {
    this.modal.show();
  }

  submit(data) {
    const venueData = {
      venueName: data.venueName,
      venueId: data.venueId,
      address: data.address
    };

    this.onSubmit.emit(venueData);
    this.modal.hide();
  }

  /**
   * Triggered after an option from google places is clicked
   * This will not be triggered after textual value is changed
   * @param address
   */
  onAddressSelect(address: RCParsedAddress) {
    this.matchForm.get('address').setValue(address);
    this.matchForm.get('venueId').setValue(null);
  }

  onVenueSelect(venue: RCVenue) {
    if (!venue) return;

    this.matchForm.get('venueName').setValue(venue.name);
    this.matchForm.get('address').setValue(venue.address);
    this.matchForm.get('venueId').setValue(venue.id);
  }
}
