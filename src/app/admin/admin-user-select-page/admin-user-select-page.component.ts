import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AdminUsersService } from "@app/admin/admin-users.service";

@Component({
  selector: "rc-admin-user-select-page",
  templateUrl: "./admin-user-select-page.component.html",
  styleUrls: ["./admin-user-select-page.component.scss"],
})
export class AdminUserSelectPageComponent implements OnInit {
  users: { id: number; text: string }[];
  loading: boolean;
  constructor(private route: Router, private adminUsers: AdminUsersService) {}

  ngOnInit() {
    this.loading = true;
    this.adminUsers
      .getUsers({
        organizationOnly: true,
      })
      .subscribe(
        (response) => {
          this.loading = false;
          this.users = response.data.map((i) => {
            return {
              text: `${i.firstName} ${i.lastName} - ${i.email}`,
              id: i.id,
            };
          });
        },
        (err) => {
          this.loading = false;
          console.log(err);
        },
      );
  }

  userSelected(user: { id: number; text: string }) {
    if (user) {
      this.adminUsers.getUserToken(user.id).subscribe(
        () => {
          this.route.navigate(["/client"]);
        },
        (err) => {
          console.error(err);
        },
      );
    }
  }
}
