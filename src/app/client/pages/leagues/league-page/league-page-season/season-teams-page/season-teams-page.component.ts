import { takeUntil } from "rxjs/operators";
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  RosterXlsUploadModalComponent,
  // tslint:disable-next-line
} from "@app/client/pages/leagues/league-page/league-page-season/season-teams-page/roster-xls-upload-modal/roster-xls-upload-modal.component";
import { TeamEditModalComponent } from "@app/shared/components/leagues/team-edit-modal/team-edit-modal.component";
import { LeaguesService } from "@app/shared/services/leagues/leagues.service";
import { TeamsService } from "@app/shared/services/teams/teams.service";
import { InvitationService } from "@app/shared/services/utils/invitation.service";
import * as _ from "lodash";
import { ModalDirective } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import {
  RCGenderEnum,
  RCMediaObject,
  RCSeasonTeam,
  RCTeamMemberRoleEnum,
  RCSeasonPoolParticipant,
  RCUser,
  RCSeasonPoolStatusEnum,
  RCLeagueSeason,
  RCSeasonRosterStatusEnum,
} from "@rcenter/core";
import { DragulaService } from "ng2-dragula";
import * as asyncJS from "async";
import { ConfirmationModalComponent } from "@app/shared/components/confirmation-modal/confirmation-modal.component";
import { AnalyticsService } from "@app/shared/services/utils/analytics.service";
import { CreateDivisionModalComponent } from "@app/shared/components/create-division-modal/create-division-modal.component";
import * as autoScroll from "dom-autoscroller";
import { Subject } from "rxjs";
import { PlayerSeasonInfoModalComponent } from "@app/shared/components/leagues/player-season-info-modal/player-season-info-modal.component";
import { RCPaymentStatus } from "@rcenter/core/models/Leagues";

export interface RCSeasonTeamMembersVM {
  notRegistered?: boolean;
  paymentStatus?: RCPaymentStatus;
  canUnassign?: boolean;
  id?: number;
  type: "invite" | "member" | "poolMember";
  name: string;
  gender?: RCGenderEnum;
  email?: string;
  phone?: string;
  picture?: RCMediaObject;
  token?: string;
  captain?: boolean;
  userId?: number;
  isRegistered: boolean;
  invitedUserId?: number;
  isInviteResent?: boolean;
  selected?: boolean;
  inviteStatus?: number;
  orderId?: number;
  remainingAmount?: number;
}

export interface SeasonPoolParticipantOrder extends RCSeasonPoolParticipant {
  orderId?: number;
  remainingAmount?: number;
}

export interface RCSeasonTeamVM extends RCSeasonTeam {
  members: RCSeasonTeamMembersVM[];
}

export interface ActionPoolItem {
  action: string;
  targetId: number;
  targetType: string;
  sourceId?: number;
  sourceType?: string;
  entityId: number;
}

@Component({
  selector: "rc-season-teams-page",
  templateUrl: "season-teams-page.component.html",
  styleUrls: ["season-teams-page.component.scss"],
})
export class SeasonTeamsPageComponent implements OnInit, OnDestroy {
  @ViewChild("saveModal") saveModal: ConfirmationModalComponent;
  @ViewChild("teamEditModal") teamEditModal: TeamEditModalComponent;
  @ViewChild("createDivisionModal") createDivisionModal: CreateDivisionModalComponent;
  @ViewChild("autoscroll") autoscroll: ElementRef;
  @ViewChild("playerInfoModal") playerInfoModal: PlayerSeasonInfoModalComponent;
  @ViewChild("removeTeamConfirmModal") removeTeamConfirmModal: ConfirmationModalComponent;
  @ViewChild("rosterXlsModal") rosterXlsModal: RosterXlsUploadModalComponent;
  teamsPoolParticipants: RCSeasonPoolParticipant[];
  seasonTeams: RCSeasonTeam[];
  seasonTeamsVM: RCSeasonTeamVM[];
  invitedList: RCSeasonTeamMembersVM[];
  currentVisibleCard: any = {};
  currentVisibleDivisionCard: any = {};
  processing: boolean;
  loadingSeasonPool: boolean;
  showSendAllInvitesBtn: boolean;
  teamInviteModal: ModalDirective;
  selectedTeamsNavigation: "freeAgents" | "invited" | "archived";
  seasonId: number;
  leagueId: number;
  archivedTeamEntities: RCSeasonPoolParticipant[];
  archivedPlayerEntities: RCSeasonTeamMembersVM[];

  freeAgentPoolParticipants: RCSeasonTeamMembersVM[];
  actionsPool: ActionPoolItem[] = [];
  season: RCLeagueSeason;
  RCSeasonRosterStatusEnum = RCSeasonRosterStatusEnum;
  divisionsEnabled = false;
  membersBag: any;
  teamsBag: any;
  destroy$ = new Subject<true>();
  constructor(
    private dragulaService: DragulaService,
    private toastr: ToastrService,
    private teamsService: TeamsService,
    private activeRoute: ActivatedRoute,
    private leaguesService: LeaguesService,
    private invitationService: InvitationService,
    private analytics: AnalyticsService,
  ) {
    this.showSendAllInvitesBtn = true;
    this.selectedTeamsNavigation = "freeAgents";

    this.membersBag = this.dragulaService.find("members-bag");
    if (this.membersBag !== undefined) {
      this.dragulaService.destroy("members-bag");
    }

    this.teamsBag = this.dragulaService.find("teams-bag");
    if (this.teamsBag !== undefined) {
      this.dragulaService.destroy("teams-bag");
    }

    // disabled drag for non draggable elements
    dragulaService.setOptions("members-bag", {
      moves: (el, source, handle, sibling) => {
        return !el.classList.contains("no-drag");
      },
    });

    dragulaService.setOptions("teams-bag", {
      direction: "horizontal",
      moves: (el, source, handle, sibling) => {
        return !handle.classList.contains("bloc--inner");
      },
      accepts: function (el, target, source, sibling) {
        return !target.classList.contains("no-drag-to");
      },
    });
  }

  showUploadRosterModal() {
    this.rosterXlsModal.showModal();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  ngOnInit() {
    // TODO: convert to view-childs instead of jquery!!!
    this.dragulaService.over.subscribe((value) => {
      $(".teams-list-wrapper").find(".dragula-hover").removeClass("dragula-hover");
      const [e, el] = value.slice(1);
      $(el).closest(".box-item").addClass("dragula-hover");
    });

    /**
     * fixes the issue when dragging an element so it will be scrolled
     * in the parent container as well
     */
    autoScroll([this.autoscroll.nativeElement], {
      margin: 20,
      maxSpeed: 5,
      scrollWhenOutside: true,
      autoScroll: function () {
        return this.down || this.up;
      },
    });

    // Here we want to catch all drop events and act depending on
    // the event occurred.
    this.dragulaService.drop.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      const bag = value[0];
      const entityId = Number(value[1].id.split("-")[1]);
      const draggedTo = value[2].id.split("-")[0];
      const draggedToId = Number(value[2].id.split("-")[1]);
      const draggedFrom = value[3].id.split("-")[0];
      const draggedFromId = Number(value[3].id.split("-")[1]);

      if (bag === "members-bag") {
        $(".teams-list-wrapper").find(".dragula-hover").removeClass("dragula-hover");

        if (draggedFrom === "freeAgentsPool" && draggedTo === "teamsPoolWrapper") {
          this.actionsPool.push({
            entityId: entityId,
            action: "playerFromPoolToTeam",
            targetId: draggedToId,
            targetType: "team",
          });
        } else if (draggedTo === "teamsPoolWrapper" && draggedFrom === "teamsPoolWrapper") {
          this.actionsPool.push({
            entityId: entityId,
            action: "playerFromTeamToTeam",
            targetId: draggedToId,
            targetType: "team",
            sourceId: draggedFromId,
            sourceType: "team",
          });
        } else if (draggedTo === "freeAgentsPool" && draggedFrom === "teamsPoolWrapper") {
          this.actionsPool.push({
            entityId: entityId,
            action: "playerRemoveFromTeam",
            targetId: draggedFromId,
            targetType: "team",
          });
        }
      } else if (bag === "teams-bag") {
        if (draggedTo === "divisionBlock") {
          const foundTeam = this.seasonTeamsVM.find((i) => i.id === entityId);

          if (foundTeam) {
            foundTeam.divisionId = draggedToId;

            this.actionsPool.push({
              entityId: foundTeam.teamId,
              action: "playerFromDivisionToDivision",
              targetId: draggedToId,
              targetType: "division",
            });
          }
        }
      }
    });

    this.leaguesService.currentTeams$.pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.seasonId = Number(this.leaguesService.currentSeasonId);
      this.leagueId = Number(this.leaguesService.currentLeagueId);

      if (this.leagueId && this.seasonId && (!this.seasonTeams || !this.seasonTeams.length)) {
        this.retreiveSeasonPool();
      }

      this.seasonTeams = response;

      if (this.seasonTeams) {
        this.createTeamsViewModel();
      } else {
        this.seasonTeamsVM = [];
        this.invitedList = [];
      }
    });

    this.leaguesService.currentSeason$.pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.season = response;

      if (this.season) {
        this.analytics.trackEvent("season-page:teams:view", {
          seasonId: this.season.id,
          seasonName: this.season.name,
        });

        if (this.season["multipleDivision"]) {
          this.divisionsEnabled = true;
        }

        if (this.season.seasonDivisions) {
          this.season.seasonDivisions.forEach((i) => {
            this.currentVisibleDivisionCard[i.id] = true;
          });
        }
      }
    });
  }

  openCreateTeamModal() {
    if (this.actionsPool.length) {
      return this.saveModal.showModal();
    }

    this.analytics.trackEvent("season-page:teams:create:start", {
      seasonId: this.season.id,
      seasonName: this.season.name,
    });

    this.teamEditModal.showModal();
  }

  retreiveSeasonPool(cb?: Function) {
    this.loadingSeasonPool = true;

    this.leaguesService.getSeasonPool().subscribe(
      (poolResponse) => {
        this.archivedTeamEntities = poolResponse.data.filter((i) => {
          return (
            i.entityType === "team" &&
            i.status !== RCSeasonPoolStatusEnum.ASSIGNED &&
            i.status === RCSeasonPoolStatusEnum.INACTIVE
          );
        });

        this.archivedPlayerEntities = poolResponse.data
          .filter((i) => {
            return (
              i.entityType === "user" &&
              i.status !== RCSeasonPoolStatusEnum.ASSIGNED &&
              i.status === RCSeasonPoolStatusEnum.INACTIVE
            );
          })
          .map((i) => {
            const user = i.userEntity || ({} as RCUser);

            return {
              canUnassign: true,
              paymentStatus: i.paymentStatus,
              type: "poolMember",
              name: user.name,
              gender: user.gender,
              email: user.email,
              picture: user.profilePicture,
              userId: user.id,
              isRegistered: true,
              orderId: i.orderId || null,
            } as RCSeasonTeamMembersVM;
          });

        this.teamsPoolParticipants = poolResponse.data.filter((i) => {
          return (
            i.entityType === "team" &&
            i.status !== RCSeasonPoolStatusEnum.ASSIGNED &&
            i.status !== RCSeasonPoolStatusEnum.INACTIVE
          );
        });

        this.freeAgentPoolParticipants = poolResponse.data
          .filter((i) => {
            return (
              i.entityType === "user" &&
              i.status !== RCSeasonPoolStatusEnum.ASSIGNED &&
              i.status !== RCSeasonPoolStatusEnum.INACTIVE
            );
          })
          .map((i) => {
            const user = i.userEntity || ({} as RCUser);

            return {
              canUnassign: true,
              paymentStatus: i.paymentStatus,
              type: "poolMember",
              name: user.name,
              gender: user.gender,
              email: user.email,
              picture: user.profilePicture,
              userId: user.id,
              isRegistered: true,
              orderId: i.orderId || null,
              remainingAmount: i.remainingAmount || 0,
            } as RCSeasonTeamMembersVM;
          });

        this.loadingSeasonPool = false;

        if (cb) {
          cb();
        }
      },
      () => {
        this.toastr.error("Error while fetching players pool");
      },
    );
  }

  retreiveSeasonTeams() {
    this.leaguesService
      .getSeasonTeams(this.leagueId, this.seasonId, {
        flagPlayerUnassign: true,
        flagPlayerPaymentStatus: true,
      })
      .subscribe((response) => {
        this.leaguesService.setCurrentTeams(response.data);
      });
  }

  assignTeamToSeason(teamId: number) {
    if (this.actionsPool.length) {
      return this.saveModal.showModal();
    }

    this.leaguesService.assignTeamToSeason(teamId).subscribe(
      (response) => {
        this.retreiveSeasonTeams();
        this.retreiveSeasonPool();
      },
      (err) => {
        this.toastr.error("Error occurred assigning the team.");
        console.error(err);
      },
    );
  }

  transferPlayerToTeam(teamId: number, userId: number, oldTeamId: number, cb: Function) {
    this.leaguesService
      .reAssignTeamMember(this.leagueId, this.seasonId, {
        userId: userId,
        oldTeamId: oldTeamId,
        newTeamId: teamId,
      })
      .subscribe(
        (response) => {
          cb();
        },
        (err) => {
          cb(err);
          this.toastr.error("Error occurred while transferring player");
        },
      );
  }

  playerTransferTeams(data) {
    let foundUser;
    this.seasonTeamsVM.forEach((seasonTeam) => {
      if (seasonTeam.teamId === data.oldTeamId) {
        if (seasonTeam.members) {
          foundUser = seasonTeam.members.find((i) => {
            return i.userId === data.userId;
          });

          if (foundUser) {
            const index = seasonTeam.members.indexOf(foundUser);
            seasonTeam.members.splice(index, 1);
          }
        }
      }
    });

    if (!foundUser) return this.toastr.error("Error locating user");
    this.seasonTeamsVM.forEach((seasonTeam) => {
      if (seasonTeam.teamId === data.newTeamId) {
        seasonTeam.members.push(foundUser);
      }
    });

    this.actionsPool.push({
      entityId: data.userId,
      action: "playerFromTeamToTeam",
      targetId: data.newTeamId,
      targetType: "team",
      sourceId: data.oldTeamId,
      sourceType: "team",
    });
  }

  promptTeamRemove(team: RCSeasonTeam) {
    if (this.actionsPool.length) {
      this.toastr.warning("Please save pending changes before removing team");
      return;
    }
    this.removeTeamConfirmModal.showModal(team);
  }

  removeSeasonTeam(team: RCSeasonTeam) {
    this.leaguesService.removeTeamAssignment(this.season.leagueId, this.season.id, team.teamId).subscribe(
      (response) => {
        this.reloadTeams();
        this.retreiveSeasonPool(() => {
          if (team.team.creatorType === "user") {
            const foundPool = this.teamsPoolParticipants.find((i) => i.entityId === team.teamId);

            if (foundPool) {
              this.leaguesService.removePoolEntity(this.season.leagueId, this.season.id, foundPool.id).subscribe(() => {
                this.reloadTeams();
                this.retreiveSeasonPool();
                this.toastr.success("Team Removed Successfully");
              });
            }
          }
        });
      },
      (err) => {
        const errorObject = err;
        this.toastr.error(errorObject.error || "Error occurred while removing team");
      },
    );
  }

  /**
   * Removes a player from team and returns it directly to the
   * free agents pool
   * @param teamId
   * @param entityId
   */

  removePlayerFromTeam(teamId: number, entityId: number, cb: Function) {
    this.leaguesService.removePlayerFromTeam(teamId, entityId).subscribe(
      (response) => {
        cb();
      },
      (err) => {
        cb(err);
        this.toastr.error("Error occurred while assigning player");
      },
    );
  }

  assignPlayerFromPoolToTeam(teamId: number, entityId: number, cb: Function) {
    this.leaguesService.assignPlayerFromPool(teamId, entityId).subscribe(
      (response) => {
        cb();
      },
      (err) => {
        cb(err);
        this.toastr.error("Error occurred while assigning player");
      },
    );
  }

  /**
   * Triggered after a modification is made to a team entity
   * We want to fetch the latest data from server
   */
  reloadTeams() {
    this.leaguesService
      .getSeasonTeams(this.leagueId, this.seasonId, {
        flagPlayerUnassign: true,
        flagPlayerPaymentStatus: true,
      })
      .subscribe((response) => {
        this.leaguesService.setCurrentTeams(response.data);

        this.leaguesService.getSeasonById(this.leagueId, this.seasonId).subscribe((season) => {
          this.leaguesService.setCurrentSeason(season.data);
        });
      });
  }

  /**
   *
   * @param sendToAll - if this parameter passed invitation will be sent to all invitee list
   * except the ones already received invitation
   */
  sendMultipleInvites(sendToAll?: boolean) {
    const tokens = this.invitedList
      .filter((i) => {
        if (i.isInviteResent) return false;
        if (sendToAll) return true;

        return i.selected;
      })
      .map((i) => i.token);

    this.sendInvites(tokens);
  }

  /**
   * Used to toggle the collapsible tabs for team components
   * @param index
   */
  openTeamCard(index: number) {
    this.currentVisibleCard[index] = !this.currentVisibleCard[index];
  }

  editTeamModalOpen(team: RCSeasonTeam) {
    if (this.actionsPool.length) {
      return this.saveModal.showModal();
    }

    this.teamEditModal.editTeam(team);
  }

  sendInvites(tokens: string[]) {
    if (!tokens.length || this.processing) return;

    this.processing = true;
    this.invitationService.resendInvites(tokens).subscribe(
      () => {
        this.processing = false;
        this.markMembersWithInviteResent(tokens);
      },
      () => {
        this.processing = false;
      },
    );
  }

  /**
   * Marks the users that received the invitation now,
   * so the admin want send second invitations again.
   * if the page is reloaded he can send them again
   * @param tokens
   */
  markMembersWithInviteResent(tokens: string[]) {
    this.seasonTeamsVM.forEach((i) => {
      i.members = i.members.map((member) => {
        const foundToken = _.find(tokens, (token) => token === member.token);

        if (foundToken) {
          member.isInviteResent = true;
        }

        return member;
      });
    });
  }

  /**
   * Triggered for single player send invitation
   * @param player
   */
  onPlayerCardResendInvite(player: RCSeasonTeamMembersVM) {
    this.sendInvites([player.token]);
  }

  inviteRemoved() {
    this.reloadTeams();
  }

  makeCaptain(teamId: number, userId: number, cb: Function) {
    this.teamsService.changeTeamMemberRole(teamId, userId, RCTeamMemberRoleEnum.ADMIN).subscribe(
      () => {
        this.markMemberAsCaptain(teamId, userId);
        cb();
      },
      (err) => {
        cb(err);
        this.toastr.error("Error while changing captain");
      },
    );
  }

  markMemberAsCaptain(teamId: number, newCaptainId: number) {
    this.actionsPool.push({
      action: "assignTeamCaptain",
      entityId: newCaptainId,
      targetId: teamId,
      targetType: "team",
    });

    this.seasonTeamsVM.forEach((seasonTeam) => {
      if (seasonTeam.teamId === teamId) {
        seasonTeam.members = seasonTeam.members.map((i) => {
          i.captain = i.userId === newCaptainId;

          return i;
        });
      }
    });
  }

  /**
   * Extracts all the invited only user from the members array
   * These are users that still don't have the app installed
   */
  createInvitedList() {
    this.invitedList = this.seasonTeamsVM
      .map((i) => {
        return i.members.filter((j) => !j.isRegistered || j.inviteStatus === 1);
      })
      .reduce((h, i) => {
        return h.concat(i);
      }, []);

    // sort by name ascending
    if (this.invitedList && this.invitedList.length) {
      this.invitedList = _.sortBy(this.invitedList, (singleElem: RCSeasonTeamMembersVM) => {
        return singleElem.name && singleElem.name.toLowerCase();
      });
    }
  }

  createTeamsViewModel() {
    if (!this.seasonTeams) return [];

    this.seasonTeamsVM = this.seasonTeams
      .map((i) => {
        if (!i.team) return;
        const teamInvites: RCSeasonTeamMembersVM[] = i.userInvites.map<RCSeasonTeamMembersVM>((invitee) => {
          return {
            canUnassign: true,
            id: invitee.id,
            captain: invitee["data"] && invitee["data"].isCaptain,
            inviteStatus: invitee.status,
            type: "invite",
            name: invitee.name,
            isRegistered: !!invitee.invitedUserId,
            phone: invitee.invitedUserPhone,
            token: invitee.token,
            email: invitee.invitedUserEmail,
          };
        });

        const teamMembers: RCSeasonTeamMembersVM[] = i.team.teamMembers.map<RCSeasonTeamMembersVM>((member) => {
          return {
            notRegistered: member.notRegistered,
            paymentStatus: member.paymentStatus,
            canUnassign: member.canUnassign,
            type: "member",
            name: member.user.firstName + " " + member.user.lastName,
            isRegistered: true,
            email: member.user.email,
            userId: member.user.id,
            gender: member.user.gender,
            picture: member.user.profilePicture,
            captain: i.captain && i.captain.id === member.user.id,
          };
        });

        return Object.assign({}, i as any, { members: [...teamMembers, ...teamInvites] });
      })
      // Remove all invites that already have been registered
      .filter((i) => {
        if (i && i.members) {
          i.members = i.members.filter((k) => !(k.isRegistered && k.type === "invite" && k.inviteStatus !== 1));
        }

        return i;
      });

    this.createInvitedList();
  }

  changeSelectedNavigation(type: "freeAgents" | "invited" | "archived") {
    this.selectedTeamsNavigation = type;
  }

  saveChanges() {
    this.processing = true;
    asyncJS.eachSeries(
      this.actionsPool,
      (item, next) => {
        if (item.action === "playerFromPoolToTeam") {
          this.assignPlayerFromPoolToTeam(item.targetId, item.entityId, next);
        } else if (item.action === "playerFromTeamToTeam") {
          this.transferPlayerToTeam(item.targetId, item.entityId, item.sourceId, next);
        } else if (item.action === "playerRemoveFromTeam") {
          this.removePlayerFromTeam(item.targetId, item.entityId, next);
        } else if (item.action === "assignTeamCaptain") {
          this.makeCaptain(item.targetId, item.entityId, next);
        } else if (item.action === "playerFromDivisionToDivision") {
          this.transferTeamDivision(item.entityId, item.targetId, next);
        } else {
          next();
        }
      },
      (err) => {
        this.processing = false;

        if (err) {
          this.toastr.error("Error occurred while making changes");
          return;
        }

        this.toastr.success("Changes successfully made");
        this.reloadTeams();

        this.actionsPool = [];
      },
    );
  }

  transferTeamDivision(teamId: number, divisionId: number, next: Function) {
    this.leaguesService.updateSeasonTeamDivision(this.leagueId, this.seasonId, teamId, divisionId).subscribe(
      () => {
        next();
      },
      (err) => {
        next(err);
        this.toastr.error("Error while updating team division id" + divisionId);
      },
    );
  }

  getDivisionTeams(id: number): RCSeasonTeamVM[] {
    if (!this.seasonTeamsVM) return [];

    return this.seasonTeamsVM.filter((i) => i.divisionId === id);
  }

  toggleDivisionCard(cardIndex: number) {
    this.currentVisibleDivisionCard[cardIndex] = !this.currentVisibleDivisionCard[cardIndex];
  }

  divisionsUpdated() {
    this.reloadTeams();
  }

  playerInfoChanged() {
    this.loadingSeasonPool = true;
    this.reloadTeams();
    this.retreiveSeasonPool();
  }

  removeSeasonPlayer(data: { seasonTeam?: RCSeasonTeam; user?: RCUser; seasonPool: RCSeasonPoolParticipant }) {
    if (!data.user) return;
    if (this.actionsPool.length) {
      this.toastr.warning("Please save pending changes before removing player");
      return;
    }

    this.loadingSeasonPool = true;
    if (data.seasonTeam && data.seasonTeam.teamId) {
      this.removePlayerFromTeam(data.seasonTeam.teamId, data.user.id, (err) => {
        if (err) return this.toastr.error("Error while removing player from team");

        if (data.seasonPool && data.seasonPool.entityType === "user") {
          this.leaguesService.removePoolEntity(this.season.leagueId, this.season.id, data.seasonPool.id).subscribe(
            () => {
              this.loadingSeasonPool = false;
              this.reloadTeams();
            },
            () => {
              this.toastr.error("Error while removing entity from pool");
            },
          );
        } else {
          this.reloadTeams();
        }
      });
    } else {
      if (data.seasonPool && data.seasonPool.entityType === "user") {
        this.leaguesService.removePoolEntity(this.season.leagueId, this.season.id, data.seasonPool.id).subscribe(
          () => {
            this.loadingSeasonPool = false;
            this.retreiveSeasonPool();
            this.reloadTeams();
          },
          () => {
            this.toastr.error("Error while removing entity from pool");
          },
        );
      }
    }
  }

  entityRestoreToPool(seasonPoolId: number) {
    this.loadingSeasonPool = true;
    this.leaguesService.restorePoolEntity(this.season.leagueId, this.season.id, seasonPoolId).subscribe(
      (response) => {
        this.toastr.success("Entity restored successfully");
        this.loadingSeasonPool = false;
        this.retreiveSeasonPool();
      },
      () => {
        this.loadingSeasonPool = false;
        this.toastr.error("Error while restoring entity");
      },
    );
  }

  restoreTeamPool(teamId: number) {
    const found = this.archivedTeamEntities.find((i) => i.entityId === teamId && i.entityType === "team");

    if (found) {
      this.entityRestoreToPool(found.id);
    } else {
      this.toastr.error("Error while restoring team");
    }
  }
}
