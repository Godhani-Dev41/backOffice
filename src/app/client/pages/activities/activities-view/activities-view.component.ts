import { Component, OnInit, ViewChild } from '@angular/core';
import { RCLeague } from '@rcenter/core';
import { AnalyticsService } from '@app/shared/services/utils/analytics.service';
import { ProgramCreateModalComponent } from '../program-create-modal/program-create-modal.component';

@Component({
  selector: 'rc-activities-view',
  templateUrl: './activities-view.component.html',
  styleUrls: ['./activities-view.component.scss']
})
export class ActivitiesViewComponent implements OnInit {
  activities: RCLeague[];
  loading: boolean;
  @ViewChild('programCreateModal', { static: true }) programCreateModal: ProgramCreateModalComponent;
  constructor(
    private analytics: AnalyticsService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.analytics.trackEvent('activities-page:open');
  }
}
