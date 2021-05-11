import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FeedService } from '@app/shared/services/feed/feed.service';
import { RCFeedItem, RCPoolItem } from '@rcenter/core';
import { RCEvent } from '@rcenter/core/models/Event';

@Component({
  selector: 'rc-event-bet-placed-generator',
  templateUrl: './event-bet-placed-generator.component.html',
  styleUrls: ['./event-bet-placed-generator.component.scss']
})
export class EventBetPlacedGeneratorComponent implements OnInit {

  @Input() feedId: string;
  feed: RCFeedItem;
  event: RCEvent;
  pollData: RCPoolItem;
  constructor(
    private feedService: FeedService
  ) { }

  ngOnInit() {
    this.feedService.getFeedByIdNonAuth(Number(this.feedId)).subscribe((response: any) => {
      this.feed = response.data;
      this.event = this.feed.event;
      this.pollData = this.feed.feedMetadata.betShare.poll;
    });
  }

  get answerText() {
    if (!this.pollData || !this.pollData.userAnswer ||  !this.pollData.possibleAnswers) return '';

    const foundAnswer = this.pollData.possibleAnswers.find(i => i.id === this.pollData.userAnswer.answerId);
    if (foundAnswer) {
      if (foundAnswer.answerType === 'draw') {
        return 'I SAY IT WILL BE DRAW';
      } else {
        return 'MY WINNER IS ' + foundAnswer.text;
      }
    }
  }
}
