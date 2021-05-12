import { RCVenue } from '@rcenter/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VenuesService } from '@app/shared/services/venues/venues.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap';
import * as moment from 'moment';
import { TimeService } from '@app/shared/services/utils/time.service';

@Component({
  selector: 'rc-booking-edit-modal',
  templateUrl: './booking-edit-modal.component.html',
  styleUrls: ['./booking-edit-modal.component.scss'],
  exportAs: 'modal'
})
export class BookingEditModalComponent implements OnInit {
  bookingForm: FormGroup;
  loading = false;
  session: any;
  @Input() spaces: any[];
  @Input() venue: RCVenue;
  @Output() onUpdate = new EventEmitter();
  @ViewChild('modal', { static: true }) modal: ModalDirective;
  constructor(
    private toastr: ToastrService,
    private venuesService: VenuesService,
    private fb: FormBuilder,
    private timeService: TimeService
  ) {
    this.bookingForm = this.fb.group({
      startTime: new Date(),
      endTime: new Date(),
      publicBooking: false,
      name: '',
      date: '',
      notes: '',
      spaceId: '',
      courtSize: 100,
    });
  }

  ngOnInit() {

  }

  onSubmit(data) {
    this.submit(data);
  }

  async submit(data) {
    const reservation: any = {
      name: data.name,
      description: data.notes
    };

    const startTime = moment(data.date)
      .hour(Number(moment(data.startTime).format('H')))
      .minute(Number(moment(data.startTime).format('m')));

    const endTime = moment(data.date)
      .hour(Number(moment(data.endTime).format('H')))
      .minute(Number(moment(data.endTime).format('m')));

    if (endTime.isBefore(startTime)) {
      this.toastr.error('Start time cant be after end time');
      return;
    }

    // get the actual start/end date/time in the LOCAL location
    const startDateHr = moment(startTime).format('YYYY-MM-DDTHH:mm:ss');
    const endDateHr = moment(endTime).format('YYYY-MM-DDTHH:mm:ss');

    const tz = this.venue['timezone'] || moment.tz.guess();
    const session: any = {
      startDate: this.timeService.dateTimeInTimeZone(startDateHr, tz),
      endDate: this.timeService.dateTimeInTimeZone(endDateHr, tz),
      spaceId: data.spaceId,
      percentage: data.courtSize
    };

    reservation.startDate = session.startDate;
    reservation.endDate = session.endDate;
    reservation.creatorId = session.spaceId;
    reservation.creatorType = 'space';

    try {
      this.loading = true;
      const tempSessionId = this.session.id.split('-');
      await this.venuesService.updateBooking(this.session.reservation.id, reservation).toPromise();
      await this.venuesService.updateSession(tempSessionId[0], session).toPromise();
      this.modal.hide();
      this.onUpdate.emit();
      this.toastr.success('Booking successfully updated');
    } catch (e) {
      console.error(e);
      this.toastr.error('Error while saving');
    } finally {
      this.loading = false;
    }
  }

  showModal(session) {
    this.session = session;
    this.modal.show();
    this.loadForEdit(session);
  }

  loadForEdit(data) {
    this.bookingForm.patchValue({
      name: data.reservation.name,
      startTime: this.timeService.switchTimeZone(data.start.format()),
      endTime: this.timeService.switchTimeZone(data.end.format()),
      date: this.timeService.switchTimeZone(data.start.format()),
      notes: data.reservation.description,
      courtSize: data.bookingSize,
      spaceId: data.resourceId
    });
  }

  cancel() {
    this.modal.hide();
  }

  async cancelSession() {
    this.loading = true;
    try {
      const tempSessionId = this.session.id.split('-');
      if (this.session.reservation) await this.venuesService.cancelBooking(this.session.reservation.id).toPromise();
      await this.venuesService.cancelSession(tempSessionId[0]).toPromise();
      this.modal.hide();
      this.onUpdate.emit();
      this.toastr.success('Session successfully canceled');
      this.loading = false;
    } catch (e) {
      console.log('e');
      this.toastr.error('Error while canceling session');
    }
  }
}
