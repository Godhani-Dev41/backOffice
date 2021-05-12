import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RCParsedAddress } from "@app/shared/services/utils/location.service";
import { VenuesService } from "@app/shared/services/venues/venues.service";
import * as moment from "moment-timezone";
import { EventsService } from "@app/shared/services/events/events.service";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { EventStatus, RCEvent, RCMediaObject, RCOrganization, RCQuestionnaireObject } from "@rcenter/core";
import { Subscription } from "rxjs";
import { ActionSuccessModalComponent } from "@app/shared/components/action-success-modal/action-success-modal.component";
import { ActivatedRoute, Router } from "@angular/router";
import { FileItem } from "ng2-file-upload";
import { OrganizationsService } from "@app/shared/services/organization/organizations.service";
import { CustomValidators } from "ng2-validation";
import { TimeService } from "@app/shared/services/utils/time.service";
import { Location } from "@angular/common";

declare var tinymce: any;
@Component({
  selector: "rc-event-creator",
  templateUrl: "./event-creator.component.html",
  styleUrls: ["./event-creator.component.scss"],
})
export class EventCreatorComponent implements OnInit, OnDestroy {
  @ViewChild("actionSuccessModal", { static: true }) actionSuccessModal: ActionSuccessModalComponent;
  eventForm: FormGroup;
  updateMode: boolean;
  loading: boolean;
  organization: RCOrganization;
  repeatVisible: boolean;
  editingEventId: number;
  editingEventObj: RCEvent;
  mainImage: RCMediaObject;
  repeatMaxDate: Date;
  private organization$: Subscription;
  newSavedEvents: number[] = [];
  currentDate = moment().toDate();
  selectedVenue: any;
  organizationVenues: any[];
  orgQuestionnaires: RCQuestionnaireObject[];
  isBasicEdit: boolean = false;
  editor: any;
  description_length: string;
  constructor(
    private venueService: VenuesService,
    private timeService: TimeService,
    private fb: FormBuilder,
    private eventsService: EventsService,
    private toastr: ToastrService,
    private auth: AuthenticationService,
    private vRef: ViewContainerRef,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private organizationService: OrganizationsService,
    private location: Location,
  ) {
    this.editor;
    this.description_length = "";
  }

  ngOnDestroy(): void {
    this.organization$.unsubscribe();
  }

  ngOnInit() {
    this.editingEventId = this.activeRoute.snapshot.params["eventId"];
    this.isBasicEdit = this.activeRoute.snapshot.params["isBasicEdit"] === "basic";

    this.organization$ = this.auth.currentOrganization.subscribe((data) => {
      this.organizationService.getOrganizationById(data.id).subscribe((response) => {
        this.organization = response.data;

        if (this.organization) {
          this.venueService.getOrganizationVenues(this.organization.id).subscribe((orgVenues) => {
            this.organizationVenues = orgVenues.data;

            if (this.editingEventId) {
              this.loadEventToEdit(this.editingEventId);
              this.updateMode = true;
            } else {
              this.updateMode = false;
            }

            this.organizationService.getOrganizationQuestionnaires(this.organization.id).subscribe((response) => {
              this.orgQuestionnaires = response.data;
            });
          });
        }
      });
    });

    this.eventForm = this.fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      sports: ["", Validators.required],
      venueName: ["", Validators.required],
      address: [""],
      venueId: "",
      spaceId: "",
      bookedSessionId: "",
      timezone: [moment.tz.guess()],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      startTime: ["", Validators.required],
      endTime: ["", Validators.required],
      participantsLimit: ["", CustomValidators.min(0)],
      ageRange: [[18, 100]],
      gender: [""],
      priceEnabled: [false],
      price: [0, CustomValidators.min(0)],
      private: [false],
      guestsCanInvite: [false],
      eventRepeat: [false],
      repeatEndDate: [""],
      eventRepeatOccurance: [""],
      mainImage: [""],
      questionnaireEnabled: [false],
      questionnaireId: [""],
    });

    this.eventForm.get("eventRepeatOccurance").valueChanges.subscribe(() => {
      this.repeatMaxDate = this.getRepeaterMaxDateValue(this.eventForm.get("startDate").value);
    });

    this.eventForm.get("venueId").valueChanges.subscribe((id) => {
      this.onVenueSelect(id);
    });

    this.eventForm.get("questionnaireId").valueChanges.subscribe((questionnaireId) => {
      if (!this.orgQuestionnaires) return;
      if (questionnaireId === "") {
        this.eventQuestionnaireEnabledToggle();
      }
    });

    this.tinyCheck();
  }

  tinyCheck() {
    if (document.querySelectorAll("textarea.desceditor").length == 0) {
      setTimeout(() => this.tinyCheck(), 300);
      return;
    }

    tinymce.init({
      selector: "textarea.desceditor",
      toolbar: "bold italic underline | alignleft aligncenter " + "alignright | bullist numlist  link| ",
      menubar: false,
      link_title: false,
      statusbar: false,
      plugins: ["advlist autolink lists link ", " paste "],
      max: 10000,
      setup: (editor) => {
        this.editor = editor;
        editor.on("init", (e) => {
          editor.setContent(this.eventForm.get("description").value || "");
        });
      },
      init_instance_callback: (editor) => this.handleValueChanged(editor),
    });
  }

  handleValueChanged(editor) {
    editor.on("input", (e) => {
      let max = editor.getParam("max");
      if (e.target.innerText.length <= max) {
        this.eventForm.get("description").setValue(e.target.innerHTML || "");
        this.description_length = e.target.innerText;
      } else {
        e.preventDefault();
      }
    });
    editor.on("ExecCommand", (e) => {
      this.eventForm.get("description").setValue(editor.getContent());
    });
    editor.on("keydown", (e) => {
      let max = editor.getParam("max");
      // handle the case where there is the length is larger or equal the maximum
      // length and enables only Backspace (e.keyCode == 8) to delete some chars
      if (e.target.innerText.length >= max) {
        if (e.keyCode == 8) {
          this.eventForm.get("description").setValue(e.target.innerHTML);
          this.description_length = e.target.innerText;
        } else {
          e.preventDefault();
        }
      }
    });
  }

  timeZoneChanged(timezone) {
    this.eventForm.get("timezone").setValue(timezone);
  }

  loadEventToEdit(id: number) {
    this.loading = true;
    this.eventsService.getEventById(id).subscribe(
      (response) => {
        const event: RCEvent = response.data;
        this.editingEventObj = event;
        this.editor.setContent(event.description);
        this.description_length = this.editor.getContent({ format: "text" });
        this.eventForm.patchValue({
          spaceId: event["spaceId"],
          venueId: event.venueId,
          title: event.title,
          description: event.description,
          sports: event.sports,
          venueName: event.venueName,
          participantsLimit: event.participantsLimit,
          address: event.address,
          bookedSessionId: event["bookedSessionId"],
          startDate: this.timeService.dateFromTimeZone(event.startDate, event.timezone),
          endDate: this.timeService.dateFromTimeZone(event.endDate, event.timezone),
          startTime: this.timeService.dateFromTimeZone(event.startDate, event.timezone),
          endTime: this.timeService.dateFromTimeZone(event.endDate, event.timezone),
          price: event.price,
          priceEnabled: !!event.price,
          gender: event["gender"],
          private: event.private,
          guestsCanInvite: event.guestsCanInvite,
          timezone: event.timezone,
          ageRange: [event["minAge"] || 6, event["maxAge"] || 120],
          questionnaireEnabled: !!event.questionnaireId,
          questionnaireId: event.questionnaireId,
        });

        if (event.mainMedia && !event.mainMedia.isDefault) {
          this.mainImage = event.mainMedia;
        }

        this.loading = false;
      },
      () => {
        this.loading = false;
        this.toastr.error("Error while fetching event to update");
      },
    );
  }

  venueSelected(address: RCParsedAddress) {
    this.selectedVenue = null;
    this.eventForm.get("address").setValue(address);
  }

  eventRepeatToggle() {
    this.eventForm.get("eventRepeat").setValue(!this.eventForm.get("eventRepeat").value);
  }

  eventPriceEnabledToggle() {
    this.eventForm.get("priceEnabled").setValue(!this.eventForm.get("priceEnabled").value);
  }

  eventQuestionnaireEnabledToggle() {
    if (this.eventForm.get("questionnaireEnabled").value) {
      this.eventForm.get("questionnaireId").setValue(null);
    }
    this.eventForm.get("questionnaireEnabled").setValue(!this.eventForm.get("questionnaireEnabled").value);
  }

  submitData(data) {
    // a hack: time is stored here in local timezone (per browser)
    // we need to convert the Timestamp from current timezone to the selected timezone
    // so we take the literal hour/minute and set that in the target timezone
    // -- regardless of our current UTC offset
    const startDateInTZ = this.timeService.dateTimeInTimeZone(data.startTime, data.timezone);
    const endDateInTZ = this.timeService.dateTimeInTimeZone(data.endTime, data.timezone);
    const eventCreateObject: any = {
      startDate: startDateInTZ,
      endDate: endDateInTZ,
      title: data.title,
      description: data.description,
      sports: data.sports,
      guestsCanInvite: data.guestsCanInvite,
      participantsLimit: data.participantsLimit,
      private: data.private,
      minAge: data.ageRange[0],
      maxAge: data.ageRange[1],
      venueName: data.venueName,
      venueId: data.venueId,
      address: data.address,
      groupingId: null,
      price: data.priceEnabled ? data.price : null,
      questionnaireId: data.questionnaireEnabled ? data.questionnaireId : null,
      timezone: data.timezone,
      paymentSettings: {
        onlinePaymentEnabled: data.priceEnabled,
      },
    };

    if (!eventCreateObject.address) {
      return this.toastr.error("Address must be selected from google autocomplete dropdown");
    }

    if (data.venueId && data.spaceId) {
      eventCreateObject.reservation = {
        isInternal: true,
        creatorId: data.spaceId,
        creatorType: "space",
      };
    }

    if (this.updateMode) return this.updateEvent(this.editingEventId, eventCreateObject);

    if (data.eventRepeat && (!data.repeatEndDate || !data.repeatEndDate)) {
      return this.toastr.warning("You must specify repeat endDate and occurrence");
    }

    // this is used to group bulk created events
    eventCreateObject.groupingId = this.guid();

    // we create the new events in draft mode by default
    eventCreateObject.status = EventStatus.DRAFT;

    const eventsToGenerate = this.generateRepeatEvent(data.eventRepeatOccurance, data.repeatEndDate, eventCreateObject);

    this.loading = true;
    this.organizationService.createBulkEvents(this.organization.id, eventsToGenerate).subscribe(
      (response) => {
        const mainMedia = this.eventForm.get("mainImage").value;
        this.newSavedEvents = response.data;

        if (mainMedia) {
          const fileName = this.eventsService.generateEventMediaFileName(data, response.data[0]);
          this.uploadMedia(mainMedia, response.data, fileName);
        } else {
          this.finishUpload();
        }
      },
      () => {
        this.finishUpload(true);
        this.toastr.error("Error occurred during creation");
      },
    );
  }

  generateRepeatEvent(timeframe: "weekly" | "monthly" | "daily" | "biWeekly", endDate: Date, event): RCEvent[] {
    const events = [{ ...event }];
    let lastEvent = event;

    if (!endDate || !moment(endDate).isValid() || moment(lastEvent.startDate).isAfter(endDate)) return events;

    while (moment(lastEvent.startDate).isBefore(endDate)) {
      const newEvent = JSON.parse(JSON.stringify(lastEvent));
      let startEventDate, endEventDate;

      switch (timeframe) {
        case "weekly":
          startEventDate = moment(lastEvent.startDate).add(1, "week").toDate();
          endEventDate = moment(lastEvent.endDate).add(1, "week").toDate();
          break;
        case "monthly":
          startEventDate = moment(lastEvent.startDate).add(1, "month").toDate();
          endEventDate = moment(lastEvent.endDate).add(1, "month").toDate();
          break;
        case "daily":
          startEventDate = moment(lastEvent.startDate).add(1, "day").toDate();
          endEventDate = moment(lastEvent.endDate).add(1, "day").toDate();
          break;
        case "biWeekly":
          startEventDate = moment(lastEvent.startDate).add(2, "week").toDate();
          endEventDate = moment(lastEvent.endDate).add(2, "week").toDate();
          break;
      }

      newEvent.startDate = startEventDate;
      newEvent.endDate = endEventDate;

      if (moment(startEventDate).isBefore(endDate)) {
        events.push(newEvent);
      }

      lastEvent = newEvent;
    }

    return events;
  }

  uploadMedia(mainMedia: FileItem, ids: number[], fileName: string) {
    if (ids.length === 1) {
      this.eventsService.uploadEventMedia(ids[0], mainMedia, fileName).subscribe(
        () => {
          this.finishUpload();
        },
        () => {
          this.finishUpload(true);
          this.toastr.error("Error while uploading image");
        },
      );
    } else {
      this.eventsService.uploadMultipleEventMedia(ids, mainMedia, fileName).subscribe(
        () => {
          this.finishUpload();
        },
        () => {
          this.finishUpload(true);
          this.toastr.error("Error while uploading image");
        },
      );
    }
  }

  updateEvent(id: number, data) {
    this.loading = true;
    this.eventsService.updateEvent(id, data).subscribe(
      () => {
        const mainMedia = this.eventForm.get("mainImage").value;

        if (mainMedia) {
          const prevMediaKey = this.editingEventObj.mainMedia ? this.editingEventObj.mainMedia.mediaKey : null;
          const fileName = this.eventsService.generateEventMediaFileName(data, id, prevMediaKey);
          this.uploadMedia(mainMedia, [id], fileName);
        } else {
          this.finishUpload();
        }
      },
      () => {
        this.toastr.error("Error while updating event");
        this.finishUpload(true);
      },
    );
  }

  finishUpload(err?: boolean) {
    this.loading = false;
    if (err) return;

    if (this.updateMode) {
      this.toastr.success("Event successfully updated");
      this.goToEvents();
    } else {
      this.actionSuccessModal.showModal();
      this.toastr.success("Event successfully created");
    }

    this.eventForm.reset();
  }

  mainImageAdded(file) {
    this.eventForm.get("mainImage").setValue(file);
  }

  assignTimeToDate(timeObject: Date, date: Date): moment.Moment {
    const hour = Number(moment(timeObject).format("HH"));
    const minute = Number(moment(timeObject).format("mm"));

    return moment(date).hour(hour).minute(minute);
  }

  publishEvent() {
    const updateObject = this.newSavedEvents.map((i) => {
      return {
        eventId: i,
        publish: true,
      };
    });

    this.loading = true;
    this.organizationService.bulkEventsEdit(this.organization.id, updateObject).subscribe(
      () => {
        this.loading = false;
        this.goToEvents();
      },
      () => {
        this.loading = false;
        this.toastr.error("Error while publishing events");
      },
    );
  }

  goToEvents() {
    this.location.back();
    //this.router.navigate(['/client/events']);
  }

  startDateSelected(date) {
    if (!this.eventForm.get("endDate").value) {
      this.eventForm.get("endDate").setValue(date);
      this.eventForm.get("startTime").setValue(moment(date).hour(18).minute(0));
      this.startTimeSelected(moment(date).hour(18).minute(0).toDate());
    } else if (moment(this.eventForm.get("endDate").value).isBefore(moment(date))) {
      this.eventForm.get("endDate").setValue(date);
    }
  }

  startTimeSelected(date) {
    this.eventForm.get("endTime").setValue(moment(date).add(1, "hours"));
  }

  getRepeaterMaxDateValue(date) {
    if (!date) return null;

    // All return 3 years to date at most
    return moment(date).add(36, "months").toDate();

    /*
      if (this.eventForm.get("eventRepeatOccurance").value === "daily") {
        return moment(date).add(1, "months").toDate();
      } else if (this.eventForm.get("eventRepeatOccurance").value === "monthly") {
        return moment(date).add(12, "months").toDate();
      } else if (this.eventForm.get("eventRepeatOccurance").value === "weekly") {
        return moment(date).add(3, "months").toDate();
      } else {
        return moment(date).add(6, "months").toDate();
      }
    */
  }

  private guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
  }

  decrementPrice() {
    if (this.eventForm.get("price").value < 1) return;

    this.eventForm.get("price").setValue(this.eventForm.get("price").value - 1);
  }

  incrementPrice() {
    this.eventForm.get("price").setValue(this.eventForm.get("price").value + 1);
  }

  onVenueSelect(id) {
    let foundVenue;
    if (this.organizationVenues) {
      foundVenue = this.organizationVenues.find((i) => {
        return i.id === Number(id);
      });
    }

    this.selectedVenue = foundVenue;
    if (!foundVenue) this.eventForm.get("spaceId").setValue(null);
    if (foundVenue) {
      this.eventForm.get("timezone").setValue(foundVenue.timezone);
      this.eventForm.get("venueName").setValue(foundVenue.name);
      this.eventForm.get("address").setValue(foundVenue.address);
    }
  }
}
