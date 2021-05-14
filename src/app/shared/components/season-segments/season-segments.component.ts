import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { DaysOfWeek } from "@app/shared/components/week-days-hours-select/week-days-hours-select.component";
import { ProgramsFormService } from "@app/shared/services/programs/programs-form.service";
import { ProgramsService, SegmentItem, SubSeason } from "@app/shared/services/programs/programs.service";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { Subject } from "rxjs";

@Component({
  selector: "rc-season-segments",
  templateUrl: "./season-segments.component.html",
  styleUrls: ["./season-segments.component.scss"],
})
export class SeasonSegmentsComponent implements OnInit, OnDestroy {
  @Input() labelString: string;
  @Input() sessions: SegmentItem[];
  @Input() disabled: boolean = false;
  @Output() onSessionChange = new EventEmitter<any[]>();
  @Output() onDangerousAccepted? = new EventEmitter();
  destroy$ = new Subject<true>();
  confirmModal: NzModalRef;
  dangerousUpdateAccepted: boolean;

  seasonToEdit: SegmentItem = {
    index: -1,
    name: "",
    startDate: "",
    endDate: "",
    useSeasonDayTime: true,
    editing: false,
    activityTimes: [],
    segmentType: "program_season",
  };

  nameEditField: string;
  newRecord: boolean;
  editIndex: number = -1;
  dangerousUpdateCss: boolean;

  weekData: DaysOfWeek[] = [];

  constructor(
    public datePipe: DatePipe,
    private programsService: ProgramsService,
    private programsFormService: ProgramsFormService,
    private modal: NzModalService,
  ) {}

  ngOnInit() {
    if (this.disabled) this.dangerousUpdateCss = true;
  }

  ngOnDestroy() {
    this.cancelEdit();
  }

  addSeasonSegment = () => {
    if (!this.disabled) {
      this.newRecord = true;
      this.seasonToEdit.index = this.sessions.length + 1;
      this.seasonToEdit.editing = true;
      const tempActTimes = this.programsService.createActivityTimes(
        this.programsFormService.seasonForm.get("activityTimes").value,
      );
      for (let day of this.programsFormService.seasonForm.get("activityTimes").value) {
        const tempAT: DaysOfWeek = {
          index: day.dayOfWeek,
          startTimeValue: day.open,
          finishTimeValue: day.close,
          active: true,
        };
        tempActTimes.splice(
          tempActTimes.findIndex((a) => a.index === day.dayOfWeek),
          1,
          { ...tempAT },
        );
      }
      this.seasonToEdit.activityTimes = [...tempActTimes];
      // this.seasonToEdit.activityTimes = [...this.programsFormService.seasonForm.getRawValue().activityTimes];
      this.sessions.push({ ...this.seasonToEdit });
    }
  };

  editSegment = (index: number) => {
    this.editIndex = index;
    this.sessions[index].editing = true;
    this.seasonToEdit = { ...this.sessions[index] };
    this.nameEditField = this.seasonToEdit.name;
    this.seasonToEdit.editing = true;
  };

  doneEditing = () => {
    if (this.seasonToEdit.name && this.seasonToEdit.startDate && this.seasonToEdit.endDate) {
      // Prepare segmentItem to add to array
      this.seasonToEdit.editing = false;

      // Remove temp obj and add final to segments
      this.sessions.splice(this.editIndex, 1, {
        ...this.seasonToEdit,
      });

      this.onSessionChange.emit(this.sessions as SubSeason[]);

      // Reset variables for next edit
      this.resetSegmentDefault();
    }
  };

  cancelEdit = (index?: number) => {
    if (this.newRecord) {
      this.sessions.splice(this.sessions.length - 1, 1);
    } else {
      if (index) {
        this.sessions[this.sessions.findIndex((c) => c.index === index)].editing = false;
      } else {
        if (Array.isArray(this.sessions)) {
          for (let segment of this.sessions) {
            if (segment.editing) segment.editing = false;
          }
        }
      }
    }
    this.resetSegmentDefault();
  };

  deleteSegment = (index: number) => {
    this.sessions.splice(index, 1);
    this.onSessionChange.emit(this.sessions as SubSeason[]);
    this.resetSegmentDefault();
  };

  resetSegmentDefault = () => {
    this.editIndex = -1;
    this.nameEditField = "";
    this.seasonToEdit.index = -1;
    this.seasonToEdit.name = "";
    this.seasonToEdit.startDate = "";
    this.seasonToEdit.endDate = "";
    this.seasonToEdit.editing = false;
    this.seasonToEdit.useSeasonDayTime = true;
    this.nameEditField = "";
    this.newRecord = false;
  };

  dateChanged = (newDate: { startDate: string; endDate: string }) => {
    this.seasonToEdit.startDate = newDate.startDate;
    this.seasonToEdit.endDate = newDate.endDate;
  };

  onNameChange = (e: any) => {
    this.seasonToEdit.name = e.target.value;
    if (this.disabled) {
      const workingIdx = this.programsFormService.seasonShallowUpdateForm
        .get("subSeasons")
        .value.findIndex((s) => s.id === this.seasonToEdit.index);

      if (workingIdx > -1) {
        const tempSessionRec = this.programsFormService.seasonShallowUpdateForm.get("subSeasons").value[workingIdx];
        tempSessionRec.name = this.seasonToEdit.name;

        const tempSessionArray = this.programsFormService.seasonShallowUpdateForm.get("subSeasons").value;
        tempSessionArray.splice(workingIdx, 1, {
          ...tempSessionRec,
        });

        this.programsFormService.seasonShallowUpdateForm.get("subSeasons").setValue(tempSessionArray);
      } else {
        const tempSessionArray = [...this.programsFormService.seasonShallowUpdateForm.get("subSeasons").value];
        tempSessionArray.push({ id: this.seasonToEdit.index, name: this.seasonToEdit.name });
        this.programsFormService.seasonShallowUpdateForm.get("subSeasons").setValue(tempSessionArray);
      }
    }
  };

  onChange = (data: DaysOfWeek[], index: number) => {
    this.seasonToEdit.activityTimes.splice(0, this.seasonToEdit.activityTimes.length, ...data);
  };

  onDangerousFieldClick = () => {
    if (this.disabled && !this.dangerousUpdateAccepted) {
      this.confirmModal = this.modal.confirm({
        nzTitle: "Do you want to edit this season?",
        nzContent:
          "If you edit this season, all product and space allocations will be removed and you must add them again manually",
        nzOnOk: () => {
          this.onDangerousAccepted.emit();
          this.dangerousUpdateAccepted = true;
          this.confirmModal.close();
        },
      });
    }
  };
}
