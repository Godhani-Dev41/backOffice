import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { RCLeagueDetailTypeEnum } from '@rcenter/core';
import { LeaguesFormService } from '@app/shared/services/leagues/leagues-form.service';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';

@Component({
  selector: 'rc-league-creator-format',
  templateUrl: './league-creator-format.component.html',
  styleUrls: ['./league-creator-format.component.scss']
})
export class LeagueCreatorFormatComponent implements OnInit, OnDestroy {
  @Input() groupName: string;
  @Input() form: FormGroup;

  RCLeagueDetailTypeEnum = RCLeagueDetailTypeEnum;
  dropModel$: Subscription;
  get formatArray(): FormArray {
    return this.form.get(this.groupName).get('formats') as FormArray;
  }

  constructor(
    private leaguesFormService: LeaguesFormService,
    private dragulaService: DragulaService
  ) { }

  ngOnInit() {
    const bag = this.dragulaService.find('formats-bag');
    if (bag !== undefined) {
      this.dragulaService.destroy('formats-bag');
    }

    // disabled drag for non draggable elements
    this.dragulaService.setOptions('formats-bag', {
      direction: 'vertical',
      moves: (el, source, handle, sibling) => !el.classList.contains('no-drag')
    });

    // this will make sure the form array was updated with relevant ordinals
    this.dropModel$ = this.dragulaService.dropModel.subscribe(() => {
      this.formatArray.controls.forEach((i, index) => {
        i.get('ordinal').setValue(index + 1);
      });
    });
  }

  ngOnDestroy(): void {
    this.dropModel$.unsubscribe();
  }

  addCustomHighlight() {
    this.formatArray.push(
      this.leaguesFormService.getDefaultFormatItem(RCLeagueDetailTypeEnum.OTHER, true, this.formatArray.controls.length + 1)
    );
  }

  createRange(number): number[] {
    const items: number[] = [];
    for (let i = 1; i <= number; i++) {
      items.push(i);
    }

    return items;
  }
}
