import { Component, Input, OnInit } from '@angular/core';
import { RCMediaObject } from '@rcenter/core';

@Component({
  selector: 'rc-team-logo-avatar',
  templateUrl: './team-logo-avatar.component.html',
  styleUrls: ['./team-logo-avatar.component.scss']
})
export class TeamLogoAvatarComponent implements OnInit {
  @Input() teamName: string;
  @Input() teamType: 'a' | 'b' = 'a';
  @Input() logo: RCMediaObject;
  constructor() { }

  getTeamInitials(name): string {
    if (!name) return '';
    const namesArray = name.split(' ');

    if (namesArray.length && namesArray.length > 1 && namesArray[0].toLowerCase().trim() === 'team') {
      return namesArray[1][0];
    } else {
      return name[0];
    }
  }

  ngOnInit() {
  }

}
