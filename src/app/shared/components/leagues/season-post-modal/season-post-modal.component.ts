import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RCSeasonRound, IRCFeedPost, RCStanding, RCPostTargetTypeEnum, RCSeasonRoundMatch } from '@rcenter/core';
import { FeedService } from '@app/shared/services/feed/feed.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
import { RCLeague } from '@rcenter/core';

type ShareType = 'roundResults' | 'seasonResults' | 'matchResults';

@Component({
  selector: 'rc-season-post-modal',
  templateUrl: './season-post-modal.component.html',
  styleUrls: ['./season-post-modal.component.scss'],
  exportAs: 'modal'
})
export class SeasonPostModalComponent implements OnInit {
  @ViewChild('modal', { static: true }) public modal: ModalDirective;
  @Input() league: RCLeague;
  roundPostForm: FormGroup;
  round: RCSeasonRound;
  match: RCSeasonRoundMatch;
  loading: boolean;
  shareType: ShareType;
  standings: RCStanding[];
  divisionId: number;
  constructor(
    private leagueService: LeaguesService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private feedService: FeedService
  ) { }

  ngOnInit() {
    this.roundPostForm = this.fb.group({
      content: ''
    });
  }

  showModal(type: ShareType, data: { round?: RCSeasonRound, standings?: RCStanding[], match?: RCSeasonRoundMatch, divisionId?: number }) {
    this.shareType = type;
    this.divisionId = null;

    if (type === 'roundResults') {
      this.round = data.round;
    } else if (type === 'seasonResults') {
      this.divisionId = data.divisionId;
      this.standings = data.standings;
    } else if (type === 'matchResults') {
      this.match = data.match;
    }

    this.modal.show();
  }

  submit(data: any) {
    if (this.loading) return;

    const post: IRCFeedPost = {
      targets: [{
        targetName: this.leagueService.currentLeagueObject.name,
        targetType: RCPostTargetTypeEnum.LEAGUE,
        targetId: this.leagueService.currentLeagueId
      }, {
        targetType: RCPostTargetTypeEnum.PUBLIC
      }],
      content: data.content,
      creatorType: 'league',
      creatorId: this.leagueService.currentLeagueId
    };

    if (this.shareType === 'roundResults') {
      post.postType = 'round';
      post.parentType = 'round';
      post.parentId = this.round.id;
    } else if (this.shareType === 'matchResults') {
      post.postType = 'match';
      post.parentType = 'match';
      post.parentId = this.match.id;
    }

    this.loading = true;

    if (this.shareType === 'seasonResults') {
      this.feedService
        .postSeasonStandings(post, this.divisionId)
        .subscribe(() => this.finishedLoading(), () => this.finishedLoading(true));
    } else {
      this.feedService
        .postFeed(post)
        .subscribe(() => this.finishedLoading(), () => this.finishedLoading(true));
    }
  }

  private finishedLoading(err?: boolean) {
    this.loading = false;

    if (err) {
      return this.toastr.error('Error occurred while creating the post');
    }

    this.toastr.success('Post successfully created!');
    this.roundPostForm.reset();
    this.modal.hide();
  }

  getHeaderText() {
    switch (this.shareType) {
      case 'roundResults':
        return 'POST ROUND RESULTS ';
      case 'seasonResults':
        return 'POST SEASON STANDINGS';
      default:
        return 'POST TO FEED';
    }
  }

  getPlaceHolderText() {
    switch (this.shareType) {
      case 'roundResults':
        return 'Great round! tell all about it... ';
      case 'seasonResults':
        return 'Great season! tell all about it...';
      default:
        return 'Tell something...';
    }
  }
}
