import { Component, OnDestroy, OnInit } from "@angular/core";
import { ProgramTypeEnum } from "@app/shared/services/programs/programs.service";
import { ProgramsService } from "@app/shared/services/programs/programs.service";
import { Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "rc-programs-view",
  templateUrl: "./program-view.component.html",
  styleUrls: ["./program-view.component.scss"],
})
export class ProgramViewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<true>();
  programs: any[];
  loading: boolean;
  programType: ProgramTypeEnum;
  orgId: number;

  constructor(private programsService: ProgramsService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.loading = true;

    this.activatedRoute.url.pipe(takeUntil(this.destroy$)).subscribe((url) => {
      this.programsService.handleProgramTypeUrlChange(url[0].path);
      this.getPrograms();
    });
    this.programsService.init().then();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  getPrograms() {
    this.loading = true;
    const orgId = this.programsService.getOrgId();
    this.programType =
      ProgramTypeEnum[
        this.programsService.getProgramType().toUpperCase() !== "CLUB"
          ? this.programsService.getProgramType().toUpperCase()
          : "CLUB_TEAM"
      ];
    this.programsService
      .getProgramsInOrganizationByType(orgId, this.programType)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.loading = false;
          this.programs = response.data;
        },
        () => {
          this.loading = false;
        },
      );
  }
}
