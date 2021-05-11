import { Component, Input, OnInit } from '@angular/core';
import { FeedService } from '@app/shared/services/feed/feed.service';
import { RCEvent } from '@rcenter/core/models/Event';
import { RCFeedItem } from '@rcenter/core/models/FeedItem';
import { RCLeagueSeason } from '@rcenter/core/models/Leagues';

@Component({
  selector: 'rc-bet-winner-generator',
  templateUrl: './bet-winner-generator.component.html',
  styleUrls: ['./bet-winner-generator.component.scss']
})
export class BetWinnerGeneratorComponent implements OnInit {
  @Input() feedId: number;

  feed: RCFeedItem;
  event: RCEvent;
  season: RCLeagueSeason;
  pollData: any;
  constructor(
    private feedService: FeedService
  ) { }

  ngOnInit() {
    this.feedService.getFeedByIdNonAuth(Number(this.feedId)).subscribe((response: any) => {
      this.feed = response.data;
      this.event = this.feed.event;
      this.season = this.feed['season'];
      this.pollData = this.feed.feedMetadata.betShare.poll;
    });
  }

}
