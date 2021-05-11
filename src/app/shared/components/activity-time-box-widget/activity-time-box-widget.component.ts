import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
import { RCVenue } from '@rcenter/core';

@Component({
  selector: 'rc-activity-time-box-widget',
  templateUrl: './activity-time-box-widget.component.html',
  styleUrls: ['./activity-time-box-widget.component.scss']
})
export class ActivityTimeBoxWidgetComponent implements OnInit {
  @Input() groupName: string;
  @Input()  arrayGroup: FormGroup;
  @Input() arrayName: string;
  @Input() form: FormGroup;
  @Input() seasonVenuesOnly: boolean;
  @Input() orgVenues: any[];
  selectedVenue: any;
  get activityDatesArray(): FormArray {
    return this.arrayGroup.get('activityDates') as FormArray;
  }

  constructor(
    private leaguesService: LeaguesService
  ) { }

  ngOnInit() {
    this.arrayGroup.get('venueId').valueChanges.subscribe((id) => {
      if (!this.orgVenues) return;
      const foundVenue = this.orgVenues.find((i) => {
        return i.id === Number(id);
      });
      this.selectedVenue = foundVenue;

      if (foundVenue) {
        this.arrayGroup.get('venueAddress').setValue('');
        this.arrayGroup.get('venueName').setValue(foundVenue.name);
        this.arrayGroup.get('venueEntityAddress').setValue(foundVenue.address);
      } else {
        this.arrayGroup.get('venueAddress').setValue('');
        this.arrayGroup.get('venueName').setValue(null);
        this.arrayGroup.get('venueEntityAddress').setValue(null);
      }
    });
  }

  addTimeSlot() {
    // Should be an output call to container item instead of here.
    this.activityDatesArray.push(
      this.leaguesService.getActivityDateFormControl()
    );
  }

  venueAddressSelected(address) {
    this.arrayGroup.get('venueId').setValue('');
    this.arrayGroup.get('venueAddress').setValue(address);
  }

  venueSelected(venue: RCVenue) {
    this.arrayGroup.get('venueAddress').setValue('');
    this.arrayGroup.get('venueId').setValue(venue.id);
    this.arrayGroup.get('venueName').setValue(venue.name);
    this.arrayGroup.get('venueEntityAddress').setValue(venue.address);

  }
}
