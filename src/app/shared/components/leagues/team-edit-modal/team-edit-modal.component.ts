import { CreateGroup, ProgramsService } from "@app/shared/services/programs/programs.service";
import { forkJoin } from "rxjs";
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LeaguesService } from "@app/shared/services/leagues/leagues.service";
import { TeamsService } from "@app/shared/services/teams/teams.service";
import { ImagesService } from "@app/shared/services/utils/images.service";
import { ModalDirective } from "ngx-bootstrap";
import { FileItem, FileUploader } from "ng2-file-upload";
import { ToastrService } from "ngx-toastr";
import { RCMediaObject, RCTeam, RCSeasonTeam } from "@rcenter/core";
import { AnalyticsService } from "@app/shared/services/utils/analytics.service";

@Component({
  selector: "rc-team-edit-modal",
  templateUrl: "./team-edit-modal.component.html",
  styleUrls: ["./team-edit-modal.component.scss"],
  exportAs: "modal",
})
export class TeamEditModalComponent implements OnInit {
  @ViewChild("modal") public modal: ModalDirective;
  @ViewChild("teamName") public teamName: any;

  @Input() leagueId: number;
  @Input() seasonId: number;
  @Input() type?: "league" | "program" = "league";
  @Input() divisionId?: number;
  @Output() onSubmit = new EventEmitter();
  logoImage: string | RCMediaObject;
  mainImage: string | RCMediaObject;
  defaultTeamLogo: boolean;
  team: RCTeam;
  editMode: boolean;
  teamEditForm: FormGroup;
  uploader: FileUploader;
  logoUploader: FileUploader;
  loading: boolean;
  mainImageDropzoneHover: boolean;
  constructor(
    private leaguesService: LeaguesService,
    private programsService: ProgramsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private teamsService: TeamsService,
    private imagesService: ImagesService,
    private analytics: AnalyticsService,
  ) {}

  ngOnInit() {
    this.editMode = false;

    this.teamEditForm = this.fb.group({
      name: "",
      description: ["", Validators.maxLength(255)],
    });

    this.logoUploader = new FileUploader({
      isHTML5: true,
      authTokenHeader: null,
      allowedFileType: ["image"],
      allowedMimeType: ["image/png", "image/jpeg", "image/jpeg"],
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader = new FileUploader({
      isHTML5: true,
      allowedFileType: ["image"],
      allowedMimeType: ["image/png", "image/jpeg", "image/jpeg"],
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onWhenAddingFileFailed = () => {
      this.toastr.error("This file type is not supported");
    };

    this.uploader.onAfterAddingFile = (file: FileItem) => {
      if (this.uploader.queue.length > 1) {
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }

      this.imagesService.getBase64FromFile(file._file).subscribe((image) => {
        this.mainImage = image;
      });
    };

    this.logoUploader.onAfterAddingFile = (file: FileItem) => {
      if (this.logoUploader.queue.length > 1) {
        this.logoUploader.removeFromQueue(this.logoUploader.queue[0]);
      }

      this.imagesService.getBase64FromFile(file._file).subscribe((image) => {
        this.logoImage = image;
      });
    };
  }

  editTeam(seasonTeam: RCSeasonTeam) {
    this.team = seasonTeam.team;

    this.editMode = true;
    this.teamEditForm.setValue({
      name: this.team.name,
      description: this.team.description,
    });

    this.mainImage = this.team.mainMedia;
    this.logoImage = this.team.logo;

    this.defaultTeamLogo = this.logoImage && this.logoImage.isDefault;
    this.modal.show();
  }

  /**
   * During drag over the file input of main images we want
   * to add animation to the hovered element and toggle focused state
   * @param isHovered
   */
  fileOverMainPhotoDrag(isHovered: boolean): void {
    this.mainImageDropzoneHover = isHovered;
  }

  showModal() {
    this.reset();
    this.modal.show();

    setTimeout(() => {
      this.teamName.nativeElement.focus();
    }, 1000);
  }

  getLogoFile(): FileItem {
    const logoFiles = this.logoUploader.getNotUploadedItems();

    if (logoFiles && logoFiles.length) {
      return logoFiles[0];
    }
  }

  getMainMedia(): FileItem {
    const logoFiles = this.uploader.getNotUploadedItems();

    if (logoFiles && logoFiles.length) {
      return logoFiles[0];
    }
  }

  submit(data) {
    if (this.loading) return;

    if (this.editMode) {
      return this.updateTeam(data);
    }

    this.loading = true;

    if (this.type === "league") {
      this.leaguesService
        .createSeasonTeam(this.leagueId, this.seasonId, {
          name: data.name,
          description: data.description,
        })
        .subscribe(
          (response) => {
            const createdTeam = response.data.id;

            this.analytics.trackEvent("season-page:teams:create:complete", {
              seasonId: this.seasonId,
              teamId: response.data.id,
              teamName: response.data.name,
            });

            this.updateMedia(createdTeam);
          },
          (err) => {
            const errorObject = err;

            if (errorObject && errorObject.code && Number(errorObject.code) === 11012) {
              this.finishSubmit("You cant create team with existing team name");
            } else {
              this.finishSubmit("Error Saving Teams");
            }
          },
        );
    } else {
      this.programsService.currentSeason.subscribe((season) => {
        const body: CreateGroup = {
          maxCapacity: season.maxParticipants,
          minAgeYears: Number(season.minAge),
          maxAgeYears: Number(season.maxAge),
          gender: season.gender,
          levelOfPlay: [...season.level],
          sports: [season.sport],
          questionnaires: (season.questionnaires && season.questionnaires.length) ? [...season.questionnaires] : null,
          divisionId: this.divisionId,
          ...data,
        };
        this.programsService.createSeasonGroup(body).subscribe(
          (response) => {
            const createdTeam = response.id;

            this.analytics.trackEvent("season-page:teams:create:complete", {
              seasonId: this.seasonId,
              teamId: response.id,
              teamName: response.name,
            });

            this.updateMedia(createdTeam);
          },
          (err) => {
            const errorObject = err;

            if (errorObject && errorObject.code && Number(errorObject.code) === 11012) {
              this.finishSubmit("You cant create team with existing team name");
            } else {
              this.finishSubmit("Error Saving Teams");
            }
          },
        );
      });
    }
  }

  updateTeam(team) {
    this.loading = true;

    this.teamsService.updateTeam(this.team.id, team).subscribe(
      () => {
        this.updateMedia(this.team.id);
      },
      (err) => {
        const errorObject = err;

        if (errorObject && errorObject.code && Number(errorObject.code) === 11012) {
          this.finishSubmit("You cant update team with existing team name");
        } else {
          this.finishSubmit("Error while updating team");
        }
      },
    );
  }

  updateMedia(teamId: number) {
    const mainMedia = this.getMainMedia();
    const logo = this.getLogoFile();

    const imagesUploadTasks = [];

    if (mainMedia) {
      imagesUploadTasks.push(this.teamsService.uploadTeamMedia(mainMedia, teamId));
      this.analytics.trackEvent("season-page:teams:create:upload-main-media", {
        seasonId: this.seasonId,
      });
    }

    if (logo) {
      imagesUploadTasks.push(this.teamsService.uploadTeamMedia(logo, teamId, "logo"));
      this.analytics.trackEvent("season-page:teams:create:upload-logo", {
        seasonId: this.seasonId,
      });
    }

    if (!imagesUploadTasks.length) return this.finishSubmit();

    forkJoin(imagesUploadTasks).subscribe(
      () => {
        this.finishSubmit();
      },
      () => {
        this.finishSubmit("Error Uploading Photos");
      },
    );
  }

  finishSubmit(err?: string) {
    this.loading = false;
    if (err) return this.toastr.error(err);

    this.toastr.success("Team Created Successfully");
    this.reset(true);

    this.onSubmit.emit();
  }

  reset(closeModal?: boolean) {
    this.loading = false;

    this.mainImage = null;
    this.logoImage = null;
    this.editMode = false;
    this.uploader.clearQueue();
    this.logoUploader.clearQueue();
    this.team = null;
    this.teamEditForm.reset();

    if (closeModal) {
      this.modal.hide();
    }
  }
}
