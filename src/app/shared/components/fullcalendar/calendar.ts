import { Component, Input, AfterViewInit, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import 'tooltipster';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import { Options } from 'fullcalendar-scheduler';
import * as moment from 'moment';

@Component({
  template: '<div></div>',
  selector: 'rc-angular2-fullcalendar',
  exportAs: 'fullCalendar'
})
export class CalendarComponent implements AfterViewInit {
  @Input() options: Options;
  text: string;

  constructor(
    private element: ElementRef
  ) {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      ($('rc-angular2-fullcalendar') as any).fullCalendar(this.options);
    }, 100);
  }

  updateEvents(events) {
    ($(this.element.nativeElement) as any).fullCalendar('removeEventSources');
    ($(this.element.nativeElement) as any).fullCalendar( 'addEventSource', events);
  }

  updateEvent(event) {
    return ($(this.element.nativeElement) as any).fullCalendar('updateEvent', event);
  }

  clientEvents(idOrFilter) {
    return ($(this.element.nativeElement) as any).fullCalendar('clientEvents', idOrFilter);
  }

  changeDate(date: moment.Moment) {
    ($(this.element.nativeElement) as any).fullCalendar('gotoDate', date);
  }
}
