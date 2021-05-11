import { Component, Input, OnInit } from '@angular/core';
import { RCMediaObject } from '@rcenter/core';
import { SportsService } from '@app/shared/services/utils/sports.service';

@Component({
  selector: 'rc-entity-round-image',
  templateUrl: './entity-round-image.component.html',
  styleUrls: ['./entity-round-image.component.scss']
})
export class EntityRoundImageComponent implements OnInit {
  @Input() image: RCMediaObject | string;
  @Input() sport: number[] | number;
  sportIcon: string;
  constructor(
    private sportsService: SportsService
  ) { }

  ngOnInit() { }

  getSportIcon() {
    if (Array.isArray(this.sport)) {
      this.sport = this.sport[0];
    }

    const sport = this.sportsService.getSport(this.sport);

    if (sport) {
      return sport.iconOutline;
    }
  }
}
