import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { RCLeagueDetailTypeEnum } from "@rcenter/core";
import { DragulaService } from "ng2-dragula";
import { ProgramsFormService } from "@app/shared/services/programs/programs-form.service";
import { Subscription } from "rxjs";

@Component({
  selector: " rc-program-creator-highlights",
  templateUrl: "./program-creator-highlights.component.html",
  styleUrls: ["./program-creator-highlights.component.scss"],
})
export class ProgramCreatorHighlights implements OnInit, OnDestroy {
  @Input() groupName: string;
  @Input() form: FormGroup;

  RCLeagueDetailTypeEnum = RCLeagueDetailTypeEnum;
  dropModel$: Subscription;

  get highlightArray(): FormArray {
    return this.form.get("programHighlights") as FormArray;
  }

  constructor(private programsFormService: ProgramsFormService, private dragulaService: DragulaService) {}

  ngOnInit() {
    const bag = this.dragulaService.find("highlights-bag");
    if (bag !== undefined) {
      this.dragulaService.destroy("highlights-bag");
    }

    // disabled drag for non draggable elements
    this.dragulaService.setOptions("highlights-bag", {
      direction: "vertical",
      moves: (el, source, handle, sibling) => !el.classList.contains("no-drag"),
    });

    // this will make sure the form array was updated with relevant ordinals
    this.dropModel$ = this.dragulaService.dropModel.subscribe(() => {
      this.highlightArray.controls.forEach((i, index) => {
        i.get("ordinal").setValue(index + 1);
      });
    });
  }

  ngOnDestroy(): void {
    this.dropModel$.unsubscribe();
  }

  addCustomHighlight() {
    /* this.highlightArray.push(
      this.programsFormService.getDefaultFormatItem(
        RCLeagueDetailTypeEnum.OTHER,
        true,
        this.highlightArray.controls.length + 1,
      ),
    );*/
  }

  createRange(number): number[] {
    const items: number[] = [];
    for (let i = 1; i <= number; i++) {
      items.push(i);
    }

    return items;
  }
}
