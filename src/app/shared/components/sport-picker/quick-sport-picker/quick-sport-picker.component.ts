import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import {
  RCSportItem,
  SportsService,
} from "@app/shared/services/utils/sports.service";

@Component({
  selector: "rc-quick-sport-picker",
  templateUrl: "./quick-sport-picker.component.html",
  styleUrls: ["./quick-sport-picker.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuickSportPickerComponent),
      multi: true,
    },
  ],
})
export class QuickSportPickerComponent
  implements OnInit, OnChanges, ControlValueAccessor {
  @Output() onChange = new EventEmitter<RCSportItem[]>();
  @Input() selectedSports: number[];
  @Input() singleSelect: boolean;
  sports: RCSportItem[];
  visibleSports: RCSportItem[];
  propagateChange = (_: any) => {};

  constructor(private sportsService: SportsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedSports) {
      this.preselectSports(this.selectedSports);
    }
  }

  preselectSports(selectedSports) {
    let finalSports: number[] = [];
    if (!Array.isArray(selectedSports)) {
      finalSports = [selectedSports];
    } else {
      finalSports = selectedSports;
    }

    const filteredSports = finalSports.map((i) => {
      const sport = this.sportsService.getSport(i);
      sport.active = true;

      if (this.sports) {
        // We want to update the whole sports list on the sports modal
        // with the currently selected items as well
        this.sports.forEach((item) => {
          if (item.id === sport.id) {
            item.active = true;
          }
        });
      }
      return sport;
    });

    this.sportsSelected(filteredSports || []);
  }

  ngOnInit() {
    this.sports = this.sportsService.getSports().map((i) => {
      i.active = false;
      return i;
    });

    this.visibleSports = this.sports.slice(0, 5);
  }

  sportsSelected(sports: RCSportItem[]) {
    this.visibleSports = sports;

    this.propagateChange(sports.map((i) => i.id));
    this.onChange.emit(sports);

    if (!sports || !sports.length) {
      this.ngOnInit();
    }
  }

  sportClicked(sport: RCSportItem) {
    if (this.singleSelect) {
      this.visibleSports.forEach((i) => (i.active = false));
    }

    sport.active = !sport.active;
    const selected = this.visibleSports.filter((i) => i.active);

    this.propagateChange(selected.map((i) => i.id));
    this.onChange.emit(selected);
  }

  writeValue(value: any): void {
    this.preselectSports(value);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched() {}
}
