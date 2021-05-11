import { Component, OnDestroy, OnInit } from "@angular/core";
import { OrganizationsService } from "@app/shared/services/organization/organizations.service";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "rc-daily-agenda",
  templateUrl: "./daily-agenda.component.html",
  styleUrls: ["./daily-agenda.component.scss"],
})
export class DailyAgendaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<true>();
  loading: boolean = false;
  reservations = [];

  constructor(private organizationsService: OrganizationsService, private auth: AuthenticationService) {}

  ngOnInit() {
    this.loading = true;
    const organization = this.auth.currentOrganization.getValue();
    this.organizationsService
      .getOrganizationAgenda(organization.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (agenda) => {
          this.reservations = [...agenda.data];
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          console.error(err);
        },
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
