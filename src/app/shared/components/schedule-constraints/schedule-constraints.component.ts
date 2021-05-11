import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { DatePipe } from "@angular/common";

export type ConstraintItem = {
  index: number;
  name: string;
  startDate: string;
  finishDate: string;
  active: boolean;
  editing: boolean;
};

@Component({
  selector: "rc-schedule-constraints",
  templateUrl: "./schedule-constraints.component.html",
  styleUrls: ["./schedule-constraints.component.scss"],
})
export class ScheduleConstraintsComponent implements OnInit, OnDestroy {
  @Input() labelString: string;
  @Input() constraints: ConstraintItem[];
  @Input() dateRange?: string[];
  @Input() disabled?: boolean = false;
  @Output() onConstraintChange = new EventEmitter<ConstraintItem[]>();

  constraintToEdit: ConstraintItem = {
    index: -1,
    name: "",
    startDate: "",
    finishDate: "",
    active: false,
    editing: false,
  };

  nameEditField: string;
  newRecord: boolean;
  editIndex: number = -1;
  dangerousUpdateCss: boolean;

  constructor(public datePipe: DatePipe) {}

  ngOnInit() {
    if (this.disabled) this.dangerousUpdateCss = true;
  }

  ngOnDestroy() {
    this.cancelEdit();
    this.resetConstraintDefault();
  }

  addConstraintBtn = () => {
    if (!this.disabled) {
      this.newRecord = true;
      this.constraintToEdit.index = this.constraints.length;
      this.constraintToEdit.editing = true;
      this.constraints.push({ ...this.constraintToEdit });
    }
  };

  editConstraint = (index: number) => {
    this.editIndex = index;
    this.constraints[index].editing = true;
    this.constraintToEdit = JSON.parse(JSON.stringify(this.constraints[index]));
    this.nameEditField = this.constraintToEdit.name;
    this.constraintToEdit.editing = true;
  };

  doneEditing = () => {
    if (this.constraintToEdit.name && this.constraintToEdit.startDate && this.constraintToEdit.finishDate) {
      // Prepare constraintItem to add to array
      this.constraintToEdit.editing = false;
      this.constraintToEdit.active = true;

      // Remove temp obj and add final to constraints
      this.constraints.splice(this.editIndex, 1, {
        ...this.constraintToEdit,
      });

      // Send to @Output()
      this.onConstraintChange.emit(this.constraints);

      // Reset variables for next edit
      this.resetConstraintDefault();
    }
  };

  cancelEdit = (index?: number) => {
    if (this.newRecord) this.constraints.splice(this.constraints.length - 1, 1);
    else {
      if (index) {
        this.constraints[this.constraints.findIndex((c) => c.index === index)].editing = false;
      } else {
        for (let constraint of this.constraints) {
          if (constraint.editing) constraint.editing = false;
        }
      }
    }
    this.resetConstraintDefault();
  };

  deleteConstraint = (index: number) => {
    this.constraints.splice(index, 1);
  };

  resetConstraintDefault = () => {
    this.constraintToEdit.index = -1;
    this.constraintToEdit.name = "";
    this.constraintToEdit.startDate = "";
    this.constraintToEdit.finishDate = "";
    this.constraintToEdit.editing = false;
    this.constraintToEdit.active = false;
    this.nameEditField = "";
    this.newRecord = false;
    this.editIndex = -1;
  };

  dateChanged = (newDate: { startDate: string; endDate: string }) => {
    this.constraintToEdit.startDate = newDate.startDate;
    this.constraintToEdit.finishDate = newDate.endDate;
  };

  onNameChange = (newName: string) => {
    this.constraintToEdit.name = newName;
  };

  onActiveChange = () => {
    this.onConstraintChange.emit(this.constraints);
  };
}
