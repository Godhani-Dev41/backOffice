import { map } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { RCUser } from "@rcenter/core/models/User";

@Component({
  selector: "rc-score-board-share-generator",
  templateUrl: "./score-board-share-generator.component.html",
  styleUrls: ["./score-board-share-generator.component.scss"],
})
export class ScoreBoardShareGeneratorComponent implements OnInit {
  positionData: any;
  user: RCUser;
  constructor(private activeRoute: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    if (this.activeRoute.snapshot.queryParams["token"] !== "2G0tr78eD8fQDFhzOfL8qXPw99bPb4Zu") return;
    if (window["Intercom"]) {
      window["Intercom"]("shutdown");
    }
    const feedId = this.activeRoute.snapshot.queryParams["feedId"];

    if (!feedId) return;
    this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/feed/${feedId}`)
      .pipe(map((response) => response))
      .subscribe((response: any) => {
        try {
          this.positionData = response.data.feedMetadata.scoreBoard;
          this.user = response.data.creator;
        } catch (e) {}
      });
  }
}
