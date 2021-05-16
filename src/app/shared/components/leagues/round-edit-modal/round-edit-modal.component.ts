import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { RCSeasonRound } from "@rcenter/core/models/Leagues";
import { LeaguesService } from "@app/shared/services/leagues/leagues.service";
import * as asyncJS from "async";
import { RCSeasonDivision } from "@rcenter/core";

@Component({
  selector: "rc-round-edit-modal",
  templateUrl: "./round-edit-modal.component.html",
  styleUrls: ["./round-edit-modal.component.scss"],
  exportAs: "modal",
})
export class RoundEditModalComponent implements OnInit {
  currentDivision: RCSeasonDivision;
  _divisions: RCSeasonDivision[];
  @Input() set divisions(divisions: RCSeasonDivision[]) {
    if (!divisions) return;
    this._divisions = divisions;

    this.divisionSelection = divisions.map((i) => {
      return {
        id: i.id,
        text: i.name,
      };
    });
  }
  @Output() onUpdated = new EventEmitter<RCSeasonRound>();
  @ViewChild("modal", { static: true }) public modal: ModalDirective;
  divisionSelection: any[];
  roundForm: FormGroup;
  loading: boolean;
  editMode: boolean;
  removeArray: number[] = [];
  constructor(private toastr: ToastrService, private leaguesService: LeaguesService, private fb: FormBuilder) {}

  getFormRoundItem(isNew = false, round?: RCSeasonRound, removable?: boolean) {
    return this.fb.group({
      roundName: [round ? round.name : "", Validators.required],
      isNew: isNew,
      removable: removable,
      roundId: round ? round.id : "",
    });
  }

  get roundsFormArray() {
    return this.roundForm.get("rounds") as FormArray;
  }

  ngOnInit() {
    this.roundForm = this.fb.group({
      rounds: this.fb.array([]),
    });

    this.editMode = false;
  }

  showModal() {
    this.clearForm();

    if (this._divisions && this._divisions.length) {
      this.divisionSelected({ id: this._divisions[0].id, text: this._divisions[0].name });
    } else {
      this.addNewRound();
    }

    this.modal.show();
  }

  onSubmit(data) {
    if (this.loading) return;
    this.loading = true;

    asyncJS.eachSeries(
      data.rounds,
      (item, next) => {
        if (item.isNew) {
          this.createRound(item.roundName, data.rounds.indexOf(item) + 1, next);
        } else {
          this.updateRound(item.roundId, item.roundName, data.rounds.indexOf(item) + 1, next);
        }
      },
      (err) => {
        this.loading = false;
        if (err) {
          return this.toastr.error("Error occurred during update");
        }

        asyncJS.eachSeries(
          this.removeArray,
          (removeItem, nextItem) => {
            this.leaguesService.removeRound(removeItem).subscribe(
              () => {
                nextItem();
              },
              (removeError) => {
                nextItem(removeError);
              },
            );
          },
          (removeError) => {
            if (removeError) {
              return this.toastr.error("Error while removing rounds");
            }

            this.onUpdated.emit();
            this.toastr.success("Rounds updated Successfully");
            this.modal.hide();
            this.roundForm.reset();
          },
        );
      },
    );
  }

  updateRound(roundId: number, roundName: string, ordinal: number, cb: Function) {
    this.leaguesService
      .updateRound(roundId, {
        name: roundName,
        ordinal: ordinal,
      })
      .subscribe(
        () => {
          cb();
        },
        (err) => {
          cb(err);
          this.toastr.error("Error occurred while updating round: " + roundName);
        },
      );
  }

  createRound(roundName: string, ordinal: number, cb: Function) {
    this.leaguesService
      .createRound({
        name: roundName,
        ordinal: ordinal,
        divisionId: this.currentDivision.id,
      })
      .subscribe(
        () => {
          cb();
        },
        (err) => {
          cb(err);
          this.toastr.error("Error occurred while saving round: " + roundName);
        },
      );
  }

  addNewRound() {
    this.roundsFormArray.push(this.getFormRoundItem(true, null, true));
  }

  removeRound(index: number) {
    const round = this.roundsFormArray.at(index);
    if (round.get("removable").value && round.get("roundId").value) {
      this.removeArray.push(round.get("roundId").value);
    }

    this.roundsFormArray.removeAt(index);
  }

  divisionSelected(data: { id: number; text: string }) {
    if (data) {
      this.clearForm();
      const foundDivision = this._divisions.find((i) => i.id === data.id);

      this.currentDivision = foundDivision;
      if (foundDivision) {
        foundDivision.rounds.forEach((i) => {
          this.roundsFormArray.push(this.getFormRoundItem(null, i, i["removable"]));
        });
      }
    }
  }

  clearForm() {
    this.removeArray = [];
    this.roundForm = this.fb.group({
      rounds: this.fb.array([]),
    });
  }
}
