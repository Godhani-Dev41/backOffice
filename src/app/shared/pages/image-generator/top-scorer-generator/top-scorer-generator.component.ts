import { Component, Input, OnInit } from '@angular/core';
import { FeedService } from '@app/shared/services/feed/feed.service';
import { RCFeedItem } from '@rcenter/core/models/FeedItem';

@Component({
  selector: 'rc-top-scorer-generator',
  templateUrl: './top-scorer-generator.component.html',
  styleUrls: ['./top-scorer-generator.component.scss']
})
export class TopScorerGeneratorComponent implements OnInit {
  @Input() feedId: number;
  feed: RCFeedItem;
  players: any[];
  constructor(
    private feedService: FeedService
  ) { }


  ngOnInit() {
    this.feedService.getFeedByIdNonAuth(Number(this.feedId)).subscribe((response: any) => {
      this.feed = response.data;
      this.players = this.feed.feedMetadata['topScorerData'].slice(0, 8);
    });
  }


}
