
import {map} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RCGamificationLevel } from '@rcenter/core/models/User';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'rc-level-up-share-generator',
  templateUrl: './level-up-share-generator.component.html',
  styleUrls: ['./level-up-share-generator.component.scss']
})
export class LevelUpShareGeneratorComponent implements OnInit {

  levelData: RCGamificationLevel;
  constructor(
    private activeRoute: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    if (this.activeRoute.snapshot.queryParams['token'] !== '2G0tr78eD8fQDFhzOfL8qXPw99bPb4Zu') return;
    if (window['Intercom']) {
      window['Intercom']('shutdown');
    }
    const feedId = this.activeRoute.snapshot.queryParams['feedId'];

    if (!feedId) return;
    this.http.get<any>(`${environment.CS_URLS.API_ROOT}/feed/${feedId}`).pipe(map((response) => response)).subscribe((response: any) => {
      try {
        this.levelData = response.data.feedMetadata.levelUp.levelConfig;
      } catch (e) {

      }
    });
  }

}
