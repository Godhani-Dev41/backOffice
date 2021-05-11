import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '@app/shared/services/utils/analytics.service';

@Component({
  selector: 'rc-venues-coming-soon',
  templateUrl: './venues-coming-soon.component.html',
  styleUrls: ['./venues-coming-soon.component.scss']
})
export class VenuesComingSoonComponent implements OnInit {

  constructor(
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.trackEvent('venues:page:enter');
  }

}
