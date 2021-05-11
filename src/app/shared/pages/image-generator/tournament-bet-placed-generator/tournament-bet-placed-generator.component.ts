import { Component, Input, OnInit } from '@angular/core';
import { FeedService } from '@app/shared/services/feed/feed.service';
import { RCPoolItem } from '@rcenter/core/models/Event';
import { RCFeedItem } from '@rcenter/core/models/FeedItem';
import { RCLeagueSeason } from '@rcenter/core/models/Leagues';

@Component({
  selector: 'rc-tournament-bet-placed-generator',
  templateUrl: './tournament-bet-placed-generator.component.html',
  styleUrls: ['./tournament-bet-placed-generator.component.scss']
})
export class TournamentBetPlacedGeneratorComponent implements OnInit {
  @Input() feedId: number;
  pollData: RCPoolItem;
  feed: RCFeedItem;
  season: RCLeagueSeason;
  constructor(
    private feedService: FeedService
  ) { }

  ngOnInit() {
    this.feedService.getFeedByIdNonAuth(Number(this.feedId)).subscribe((response: any) => {
      this.feed = response.data;
      this.season = this.feed['season'];
      this.pollData = this.feed.feedMetadata.betShare.poll;
    });
  }

  get getTeamAnswer() {
    if (!this.pollData) return '';

    const foundAnswer = this.pollData.possibleAnswers
      .find(i => i.id === this.pollData.userAnswer.answerId);

    if (foundAnswer.answerType === 'draw') return 'DRAW';
    return foundAnswer.parent['name'];
  }

}
