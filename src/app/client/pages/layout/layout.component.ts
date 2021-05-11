import { Component, OnInit } from '@angular/core';
import { AdminAuthService } from '@app/shared/services/auth/admin-auth.service';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';

@Component({
  selector: 'rc-layout',
  templateUrl: 'layout.component.html',
  styleUrls: ['layout.component.scss']
})
export class LayoutComponent implements OnInit {
  adminLogged: boolean;
  loggedUser: any;
  constructor(
    private auth: AuthenticationService,
    private adminAuth: AdminAuthService
  ) { }

  ngOnInit() {
    this.loggedUser = this.auth.getTokenData();
    this.adminLogged = this.adminAuth.isLoggedIn();
  }

}
