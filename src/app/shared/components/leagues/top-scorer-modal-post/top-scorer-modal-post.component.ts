import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedService } from '@app/shared/services/feed/feed.service';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
import { RCLeagueSeason, RCSeasonTeam, IRCFeedPost, RCPostTargetTypeEnum } from '@rcenter/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'rc-top-scorer-modal-post',
  templateUrl: './top-scorer-modal-post.component.html',
  styleUrls: ['./top-scorer-modal-post.component.scss'],
  exportAs: 'modal'
})
export class TopScorerModalPostComponent implements OnInit {
  @ViewChild('modal', { static: true }) public modal: ModalDirective;
  publishTopScorerForm: FormGroup;
  loading = false;
  season: RCLeagueSeason;
  teamsSelection = [];
  teams: RCSeasonTeam[] = [];
  constructor(
    private feedService: FeedService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private leaguesService: LeaguesService
  ) {

    this.publishTopScorerForm = this.fb.group({
      players: this.fb.array([])
    });

    for (let i = 0; i < 6; i++) {
      this.addPlayer();
    }
  }

  ngOnInit() {
  }

  submit(data) {
    const players = data.players
      .filter(i => i.name)
      .map((i) => {
        if (i.team.length) {
          const foundTeam = this.teams.find(j => j.teamId === i.team[ 0 ].id);

          const player: any = {
            name: i.name,
            score: i.score
          };

          if (foundTeam && foundTeam.team) {
            player.teamLogo = foundTeam.team.logo;
            player.teamName = foundTeam.team.name;
            player.teamId = foundTeam.teamId;
          }

          return player;
        }
      });

    if (!players.length) return this.toastr.error('Provide at least one player');
    for (const player of players) {
      if (!player || !player.name || !player.teamName || !player.score) {
        return this.toastr.error('You must provide score, team and name');
      }
    }


    const post: IRCFeedPost = {
      targets: [ {
        targetName: this.season.seasonLeague.name,
        targetType: RCPostTargetTypeEnum.LEAGUE,
        targetId: this.season.seasonLeague.id
      }, {
        targetType: RCPostTargetTypeEnum.PUBLIC
      } ],
      content: data.content,
      creatorType: 'league',
      creatorId: this.season.seasonLeague.id
    };

    post.postType = 'topScorerOld' as any;
    post.parentType = 'league';
    post.parentId = this.season.seasonLeague.id;
    post['feedMetadata'] = {
      topScorerData: players.sort((a, b) => b.score - a.score)
    };

    this.loading = true;
    this.feedService
      .postFeed(post)
      .subscribe(() => {
        this.loading = false;
        this.modal.hide();
        this.toastr.success('Posted successfully');
      }, () => {
        this.loading = false;
        this.toastr.error('Error while posting');
      });
  }

  get playersArray() {
    return this.publishTopScorerForm.get('players') as FormArray;
  }

  addPlayer() {
    this.playersArray.push(this.fb.group({
      name: [''],
      team: [''],
      score: ['']
    }));
  }

  showModal(season: RCLeagueSeason) {
    this.season = season;
    this.loading = true;

    this.leaguesService.getSeasonTeams(this.season.seasonLeague.id, this.season.id).subscribe((response) => {
      this.teams = response.data;
      this.loading = false;
      this.teamsSelection = response.data.filter(i => i.team).map((i) => ({
        id: i.team.id,
        text: i.team.name
      }));
    });

    this.modal.show();
  }
}
