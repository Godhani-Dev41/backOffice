import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RCFeedItem } from '@rcenter/core';
import { FeedService } from '@app/shared/services/feed/feed.service';
import { SportsService } from '@app/shared/services/utils/sports.service';

@Component({
  selector: 'rc-player-looking-for-team',
  templateUrl: './player-looking-for-team.component.html',
  styleUrls: ['./player-looking-for-team.component.scss']
})
export class PlayerLookingForTeamComponent implements OnInit {

  feed: RCFeedItem;
  constructor(
    private activeRoute: ActivatedRoute,
    private SportsService: SportsService,
    private feedService: FeedService
  ) { }

  ngOnInit() {
    if (this.activeRoute.snapshot.queryParams['token'] !== '2G0tr78eD8fQDFhzOfL8qXPw99bPb4Zu') return;
    const { feedId } = this.activeRoute.snapshot.queryParams;
    if (window['Intercom']) {
      window['Intercom']('shutdown');
    }
    this.feedService.getFeedByIdNonAuth(feedId).subscribe((response: any) => {
      this.feed = response.data;
    });
  }


  getLevelOfPlayText(id: number) {
    if (!id) return '';

    return this.SportsService.getLevelOfPlayText(id);
  }

}
