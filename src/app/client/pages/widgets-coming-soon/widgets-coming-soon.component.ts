import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '@app/shared/services/utils/analytics.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'rc-widgets-coming-soon',
  templateUrl: './widgets-coming-soon.component.html',
  styleUrls: ['./widgets-coming-soon.component.scss']
})
export class WidgetsComingSoonComponent implements OnInit {
  url: string;
  constructor(
    private http: HttpClient,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.trackEvent('widgets:page:enter');
  }

}
