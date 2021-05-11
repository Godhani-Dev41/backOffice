import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { ProgramsService, SegmentItem, SubSeason } from "@app/shared/services/programs/programs.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { RCVenue, RCVenueSpace } from "../../../../../../core/dist";

export interface SpaceAlloc {
  segmentId: number;
  spaceId: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  active: boolean;
  editing: boolean;
  description?: string;
}

@Component({
  selector: "rc-space-allocation-management",
  templateUrl: "./space-allocation-management.component.html",
  styleUrls: ["./space-allocation-management.component.scss"],
})
export class SpaceAllocationManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<true>();
  @Input() labelString: string;
  @Input() allocs?: SpaceAlloc[] = [];
  @Input() sessions?: any[] = [];
  @Input() venues: RCVenue[];
  @Input() disabled?: boolean = false;
  @Output() onAllocChange = new EventEmitter<SpaceAlloc[]>();

  displaySessions: any[] = [];
  spaces: RCVenueSpace[] = [];

  selectedSession: number;
  selectedVenue: number;
  selectedSpace: number;

  disableVenue: boolean = true;
  disableSpace: boolean = true;

  addError: string = "";

  allocToEdit: SpaceAlloc = {
    segmentId: -1,
    spaceId: -1,
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    active: false,
    editing: false,
    description: "",
  };

  nameEditField: string;
  newRecord: boolean;

  constructor(private programsService: ProgramsService, public datePipe: DatePipe) {}

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  ngOnInit() {
    this.programsService.currentSeason$.pipe(takeUntil(this.destroy$)).subscribe((season) => {
      if (season) {
        this.programsService.getSpaceAllocations(season.id).subscribe((allocs) => {
          if (allocs.length > 0) {
          }
        });
      }
    });
    this.sessions.forEach((session, idx: number) => {
      const allocated = this.allocs.find((a) => a.segmentId === session.index || a.startDate === session.date);
      if (!allocated) {
        this.displaySessions.push({
          id: session.index || session.id,
          name:
            !session.segmentType || session.segmentType === "event"
              ? this.datePipe.transform(session.date, "MMM d, y")
              : session.name +
                " (" +
                this.datePipe.transform(session.startDate, "MMM d, y") +
                " - " +
                this.datePipe.transform(session.endDate, "MMM d, y") +
                ")",
        });
      }
    });
    /*.sort(
        (a, b) =>
          new Date(a.startDate ? a.startDate : a.date).getDate() -
          new Date(b.startDate ? b.startDate : b.date).getDate(),
      )
      .forEach((session, idx: number) => {
        const allocated = this.allocs.find((a) => a.segmentId === session.index || a.startDate === session.date);
        if (!allocated) {
          this.displaySessions.push({
            id: session.index || session.id,
            name:
              !session.segmentType || session.segmentType === "event"
                ? this.datePipe.transform(session.date, "MMM d, y")
                : session.name +
                  " (" +
                  this.datePipe.transform(session.startDate, "MMM d, y") +
                  " - " +
                  this.datePipe.transform(session.endDate, "MMM d, y") +
                  ")",
          });
        }
      });*/
  }

  addAllocBtn = () => {
    if (this.selectedSession && this.selectedVenue && this.selectedSpace) {
      this.addError = "";
      const tempSession = this.sessions.find(
        (session) => session.index === this.selectedSession || session.id === this.selectedSession,
      );
      const tempDisplaySession = this.displaySessions.find((session) => session.id === this.selectedSession);
      const newAllocation = {
        segmentId: this.selectedSession,
        spaceId: this.selectedSpace,
        startDate:
          !tempSession.segmentType || tempSession.segmentType === "event"
            ? `${tempSession.startDateString} ${tempSession.startTime}`
            : tempSession.startDate,
        endDate:
          !tempSession.segmentType || tempSession.segmentType === "event"
            ? `${tempSession.endDateString} ${tempSession.endTime}`
            : tempSession.endDate,
        startTime: "",
        endTime: "",
        active: true,
        editing: false,
        description: tempDisplaySession.name,
      };
      this.allocs.push(newAllocation);
      this.onAllocChange.emit([...this.allocs]);
      this.displaySessions.splice(
        this.displaySessions.findIndex((s) => s.id === this.selectedSession),
        1,
      );
      this.disableVenue = this.disableSpace = true;
      this.selectedSession = this.selectedVenue = this.selectedSpace = undefined;
    } else {
      this.addError = "Please select a session, facility, and space to add an allocation";
    }
  };

  editAlloc = (index: number) => {
    this.allocs[index].editing = true;
    this.allocToEdit = { ...this.allocs[index] };
    // this.nameEditField = this.allocToEdit.name;
    this.allocToEdit.editing = true;
  };

  doneEditing = () => {
    /* if (this.allocToEdit.name && this.allocToEdit.price) {
      // Prepare AddOnItem to add to array
      this.allocToEdit.editing = false;
      this.allocToEdit.active = true;

      // Remove temp obj and add final to constraints
      this.allocs.splice(this.allocToEdit.index, 1, {
        ...JSON.parse(JSON.stringify(this.allocToEdit)),
      });

      console.log("this.addOns", this.allocs);

      // Send to @Output()
      this.onAllocChange.emit(this.allocs);

      // Reset variables for next edit
      this.resetAllocDefault();
    }*/
  };

  cancelEdit = (index: number) => {
    if (this.newRecord) this.allocs.splice(index, 1);
    // this.allocs[this.allocs.findIndex((c) => c.index === index)].editing = false;
    this.resetAllocDefault();
  };

  deleteAlloc = (index: number) => {
    const tempAlloc = this.allocs[index];
    const tempSession = this.sessions.find((session) => session.index === tempAlloc.segmentId);

    this.allocs.splice(index, 1);
    this.displaySessions.push({
      id: tempSession.index,
      name:
        tempSession.segmentType && tempSession.segmentType === "event"
          ? this.datePipe.transform(tempSession.startDateString, "MMM d, y")
          : tempSession.name +
            " (" +
            this.datePipe.transform(tempSession.startDate, "MMM d, y") +
            " - " +
            this.datePipe.transform(tempSession.endDate, "MMM d, y") +
            ")",
    });
    this.resetAllocDefault();
  };

  resetAllocDefault = () => {
    this.allocToEdit.editing = false;
    this.allocToEdit.active = false;
    this.nameEditField = "";
    this.newRecord = false;
  };

  onAllocChanged = (newAllocs: unknown) => {};

  onSessionChange = () => {
    this.disableVenue = false;
    this.disableSpace = true;
  };

  onVenueChange = () => {
    this.spaces = [...this.venues.filter((s) => s.id === this.selectedVenue)[0].spaces];
    this.disableSpace = false;
  };

  onSpaceChange = () => {};

  getSpacesDisplay = (alloc: SpaceAlloc) => {
    let facilityName: string = "";
    let spaceName: string = "";
    this.venues.find((v) => {
      const tempSpace = v.spaces.find((s) => Number(s.id) === alloc.spaceId);
      if (tempSpace) {
        spaceName = tempSpace.name;
        facilityName = v.name;
        return !!tempSpace;
      }
    });
    return spaceName + " @ " + facilityName;
  };
}
