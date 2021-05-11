import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'rc-image-generator',
  templateUrl: './image-generator.component.html',
  styleUrls: ['./image-generator.component.scss']
})
export class ImageGeneratorComponent implements OnInit {

  /**
   * eventBetPlaceShare - requires query param: - feedId
   */
  widgetType: 'eventBetPlaceShare' | 'betWinner' | 'tournamentBetPlaced' | 'topScorer';
  feedId: string;
  constructor(private activeRoute: ActivatedRoute) {
    if (window['Intercom']) {
      window['Intercom']('shutdown');
    }
  }

  ngOnInit() {
    if (this.activeRoute.snapshot.queryParams['token'] !== '2G0tr78eD8fQDFhzOfL8qXPw99bPb4Zu') return;

    this.widgetType = this.activeRoute.snapshot.queryParams['type'];
    this.feedId = this.activeRoute.snapshot.queryParams['feedId'];

  }

}
