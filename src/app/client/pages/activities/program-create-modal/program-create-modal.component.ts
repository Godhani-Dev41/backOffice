import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "program-create-modal",
  templateUrl: "./program-create-modal.component.html",
  styleUrls: ["./program-create-modal.component.scss"],
  exportAs: "modal",
})
export class ProgramCreateModalComponent implements OnInit {
  loading = false;
  league = {
    type: "league",
    title: "LEAGUE",
    description: "Create new league with seasons and teams",
    icon: "assets/img/leagues.svg",
    url: "/client/leagues/league-creator",
  };
  tournament = {
    type: "tournament",
    title: "TOURNAMENT",
    description: "Create new tournament with participants",
    icon: "assets/img/tournaments.svg",
    url: "/client/tournaments/edit",
  };
  camp = {
    type: "camp",
    title: "CAMP",
    description: "Create new camp with seasons and participants",
    icon: "assets/img/camps.svg",
    url: "/client/programs/camps/basic",
  };
  clinic = {
    type: "clinic",
    title: "CLINIC",
    description: "Create new clinic with seasons and attendees",
    icon: "assets/img/clinics.svg",
    url: "/client/programs/clinics/basic",
  };
  class = {
    type: "class",
    title: "CLASS",
    description: "Create new class with attendees",
    icon: "assets/img/classes.svg",
    url: "/client/programs/classes/basic",
  };
  club = {
    type: "club",
    title: "CLUB TEAMS",
    description: "Create new club teams with participants",
    icon: "assets/img/clubs.svg",
    url: "/client/programs/clubs/basic",
  };
  lesson = {
    type: "lesson",
    title: "PRIVATE LESSON",
    description: "Create new private lesson",
    icon: "assets/img/lessons.svg",
    url: "/client/programs/lessons/basic",
  };

  @ViewChild("modal", { static: true }) modal: ModalDirective;
  constructor(private router: Router, private toastr: ToastrService) {}

  ngOnInit() {}

  cancel() {
    this.modal.hide();
  }

  showModal() {
    this.modal.show();
  }

  click(data) {
    if (data.url && data.url !== "") {
      this.router.navigate([data.url]);
    } else {
      this.toastr.error(`Creating ${data.type} is coming Soon!`);
    }
  }
}
