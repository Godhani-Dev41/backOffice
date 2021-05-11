import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from "@angular/core";
import { CreateDivision, ProgramsService, RCProgramSeason } from "@app/shared/services/programs/programs.service";
import { ModalDirective } from "ngx-bootstrap";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LeaguesService } from "@app/shared/services/leagues/leagues.service";
import { RCLeagueSeason, RCSeasonDivision } from "@rcenter/core";
import { ToastrService } from "ngx-toastr";
import { PresetColorPickerComponent } from "@app/shared/components/preset-color-picker/preset-color-picker.component";

interface DivisionsForm {
  divisions: DivisionItem[];
}

interface DivisionItem {
  id?: number;
  name: string;
  color: string;
  ordinal: number;
}

@Component({
  selector: "rc-create-division-modal",
  templateUrl: "./create-division-modal.component.html",
  styleUrls: ["./create-division-modal.component.scss"],
  exportAs: "modal",
})
export class CreateDivisionModalComponent implements OnInit {
  private _season: RCLeagueSeason | RCProgramSeason;
  @Input() set season(season: RCLeagueSeason | RCProgramSeason) {
    this._season = season;

    if (season && season.seasonDivisions) {
      this.populateSeasonDivisions(season.seasonDivisions);
    }
  }
  @Input() type?: "league" | "program" = "league";
  @Output() onUpdate = new EventEmitter();

  @ViewChild("colorPicker") colorPicker: PresetColorPickerComponent;
  @ViewChild("modal") modal: ModalDirective;
  divisionsForm: FormGroup;
  loading = false;
  updateMode = false;

  constructor(
    private toastr: ToastrService,
    private leagueService: LeaguesService,
    private programService: ProgramsService,
    private fb: FormBuilder,
  ) {
    this.divisionsForm = this.fb.group({
      divisions: this.fb.array([]),
    });
  }

  get divisionsArray(): FormArray {
    return this.divisionsForm.get("divisions") as FormArray;
  }

  ngOnInit() {}

  populateSeasonDivisions(divisions: RCSeasonDivision[]) {
    if (!divisions || !divisions.length) {
      setTimeout(() => {
        this.addDivision();
        this.addDivision();
      }, 500);
      return;
    }

    if (divisions.length > 1) {
      this.updateMode = true;
    }

    divisions.forEach((division) => {
      this.divisionsArray.push(this.addDivisionsObject(division.color, division.name, division.id));
    });

    if (divisions.length === 1) {
      setTimeout(() => {
        this.addDivision();
      }, 500);
    }
  }

  showModal() {
    this.modal.show();
    this.clearForm();
    if (this._season.seasonDivisions) {
      this.populateSeasonDivisions(this._season.seasonDivisions);
    }
  }

  clearForm() {
    this.divisionsForm.reset();

    const itemsToRemove = this.divisionsArray.length;
    for (let i = itemsToRemove; i >= 0; i--) {
      this.divisionsArray.removeAt(i);
    }
  }

  addDivisionsObject(color?: string, name?: string, id?: number) {
    return this.fb.group({
      removable: [!!id === false],
      id: [id || ""],
      name: [name || "", Validators.required],
      color: [color || "#4990e2", Validators.required],
    });
  }

  addDivision() {
    this.divisionsArray.push(this.addDivisionsObject(this.getUniqueColor()));
  }

  removeDivision(index: number) {
    this.divisionsArray.removeAt(index);
  }

  submit(data: DivisionsForm) {
    if (!this.divisionsForm.valid) return;
    const divisionsData = data.divisions.map((division, index) => {
      return {
        ordinal: index + 1,
        name: division.name,
        color: division.color,
        id: division.id,
      };
    });

    this.loading = true;

    if (this.type === "league") {
      const tempSeason = this._season as RCLeagueSeason;
      this.leagueService.updateDivisions(tempSeason.leagueId, tempSeason.id, divisionsData).subscribe(
        (response) => {
          tempSeason.multipleDivision = true;
          tempSeason.seasonDivisions = response.data;
          this.leagueService.setCurrentSeason(tempSeason as RCLeagueSeason);
          this.toastr.success("Divisions updated successfully");

          this.onUpdate.emit();
          this.loading = false;
          this.modal.hide();
        },
        () => {
          this.loading = false;
        },
      );
    } else if (this.type === "program") {
      const tempSeason = this._season as RCProgramSeason;
      const finalDivData: CreateDivision[] = [];
      for (let div of divisionsData) {
        finalDivData.push({
          programSeasonId: this.programService.getSeasonId(),
          isDefault: false,
          name: div.name,
          ordinal: div.ordinal,
          color: div.color,
        } as CreateDivision);
      }
      this.programService.updateDivisions(finalDivData).subscribe(
        (response) => {
          tempSeason.seasonDivisions = response.data;
          this.programService.currentSeason.next(tempSeason as RCProgramSeason);
          this.toastr.success("Divisions updated successfully");

          this.onUpdate.emit();
          this.loading = false;
          this.modal.hide();
        },
        () => {
          this.loading = false;
        },
      );
    }
  }

  /**
   * Finds a an unused division color
   * if no unique colors found it will choose random color again.
   * @returns { string }
   */
  private getUniqueColor(): string {
    if (!this.colorPicker) return "#ff323b";

    const currentColors = this.divisionsArray.getRawValue().map((i) => i.color);
    const uniqueColors = this.colorPicker.colors.filter((i) => {
      return !currentColors.includes(i);
    });

    return uniqueColors[0] || this.getRandomColor();
  }

  private getRandomColor(): string {
    return this.colorPicker.colors[Math.floor(Math.random() * (this.colorPicker.colors.length + 1))];
  }
}
