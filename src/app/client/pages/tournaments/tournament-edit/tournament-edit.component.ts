import { from as observableFrom, Subscription } from "rxjs";
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RCLeagueBookingStateEnum, RCLeagueDetailTypeEnum, RCOrganization, RCLinkedAccountStatus } from "@rcenter/core";
import { TournamentService } from "@app/shared/services/tournament/tournament.service";
import { ToastrService } from "ngx-toastr";
import { OrganizationsService } from "@app/shared/services/organization/organizations.service";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import * as moment from "moment-timezone";
import { ActionSuccessModalComponent } from "@app/shared/components/action-success-modal/action-success-modal.component";
import { ActivatedRoute, Route, Router, RouterLink } from "@angular/router";

// tslint:disable-next-line
import "rxjs";

@Component({
  selector: "rc-tournament-edit",
  templateUrl: "./tournament-edit.component.html",
  styleUrls: ["./tournament-edit.component.scss"],
})
export class TournamentEditComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("actionSuccessModal") actionSuccessModal: ActionSuccessModalComponent;

  tournamentForm: FormGroup;
  processing: boolean;
  currentOrganizationId: number;
  tournamentId: number;
  organizationSubscribe$: Subscription;
  organization: RCOrganization;
  get tournmanetInfoGroup() {
    return this.tournamentForm.get("tournamentInfo");
  }
  constructor(
    private authService: AuthenticationService,
    private route: Router,
    private tournamentService: TournamentService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private vRef: ViewContainerRef,
    private organizationService: OrganizationsService,
  ) {
    this.tournamentForm = this.fb.group({
      tournamentInfo: this.fb.group({
        timezone: [moment.tz.guess()],
        name: ["", Validators.required],
        description: ["", Validators.required],
        description_length: [""],
        shortDescription: [""],
        shortDescription_length: [""],
        address: ["", Validators.required],
        venueAddress: ["", Validators.required],
        sport: ["", Validators.required],
        mainImage: [""],
        logoImage: [""],
        gameDuration: [30, Validators.required],
        ageRange: [[18, 100], Validators.required],
        gender: ["", Validators.required],
        levelOfPlay: ["", Validators.required],
      }),
    });

    this.organizationSubscribe$ = this.authService.currentOrganization.subscribe((data) => {
      this.currentOrganizationId = data.id;

      this.organizationService.getOrganizationById(this.currentOrganizationId).subscribe((orgResponse) => {
        this.organization = orgResponse.data;
      });
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {}

  ngOnDestroy() {
    this.organizationSubscribe$.unsubscribe();
  }

  submitTournament(data) {
    const { tournamentInfo } = data;
    const tournamentCreateData = {
      address: tournamentInfo.address,
      league: {
        name: tournamentInfo.name,
        sports: tournamentInfo.sport,
        organizationId: this.currentOrganizationId,
        description: tournamentInfo.description,
        shortDescription: tournamentInfo.shortDescription,
        addressName: tournamentInfo.venueAddress,
        timezone: tournamentInfo.timezone || moment.tz.guess(),
        bookingStateStatus: RCLeagueBookingStateEnum.BOOK_BY_EMAIL,
      },
      leagueDetails: [
        {
          ordinal: 1,
          detailType: RCLeagueDetailTypeEnum.GENDER,
          data: tournamentInfo.gender,
        },
        {
          ordinal: 2,
          detailType: RCLeagueDetailTypeEnum.MINAGE,
          data: tournamentInfo.ageRange[0],
        },
        {
          ordinal: 3,
          detailType: RCLeagueDetailTypeEnum.MAXAGE,
          data: tournamentInfo.ageRange[1],
        },
        {
          ordinal: 4,
          detailType: 12,
          data: tournamentInfo.gameDuration,
        },
        {
          ordinal: 5,
          detailType: RCLeagueDetailTypeEnum.LEVELOFPLAY,
          data: tournamentInfo.levelOfPlay,
        },
      ],
    };

    if (
      (this.organization && this.organization.braintreeAccount === RCLinkedAccountStatus.ACTIVE) ||
      this.organization.braintreeAccount === RCLinkedAccountStatus.PENDING
    ) {
      tournamentCreateData.league.bookingStateStatus = RCLeagueBookingStateEnum.BOOK_DIRECTLY;
    }

    this.processing = true;

    this.tournamentService.createTournament(tournamentCreateData).subscribe(
      (response) => {
        this.tournamentId = response.data.id;
        this.updateMedia(response.data.id);
      },
      (err) => {
        const errorObject = err;
        this.finishSubmit("Error occurred while create tournament");
      },
    );
  }

  updateMedia(tournamentId: number) {
    const mainMedia = this.tournamentForm.get("tournamentInfo").get("mainImage").value;
    const logo = this.tournamentForm.get("tournamentInfo").get("logoImage").value;

    const imagesUploadTasks = [];

    if (mainMedia) {
      imagesUploadTasks.push(this.tournamentService.uploadTournamentMedia(mainMedia, tournamentId));
    }

    if (logo) {
      imagesUploadTasks.push(this.tournamentService.uploadTournamentMedia(logo, tournamentId, "logo"));
    }

    if (!imagesUploadTasks.length) return this.finishSubmit();

    observableFrom(imagesUploadTasks).subscribe(
      () => {
        this.finishSubmit();
      },
      () => {
        this.finishSubmit("Error Uploading Photos");
      },
    );
  }

  finishSubmit(err?) {
    this.processing = false;

    if (err) {
      return;
    }

    this.actionSuccessModal.showModal();
    this.tournamentForm.reset({
      name: "",
      description: "",
      shortDescription: "",
      address: "",
      venueAddress: "",
      sport: "",
      mainImage: "",
      logoImage: "",
      gameDuration: [90],
      ageRange: [15, 60],
      gender: "",
      levelOfPlay: "",
    });

    this.toastr.success("Tournament Successfully Created");
  }

  goToDashboard() {
    this.route.navigate(["/client/tournaments/view/" + this.tournamentId]);
  }

  goToCreateEvent() {
    this.route.navigate(["/client/tournaments/view/" + this.tournamentId + "/item-edit"]);
  }
}
