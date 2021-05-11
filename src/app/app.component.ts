import { Component, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment';

@Component({
  selector: 'rc-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private vRef: ViewContainerRef
  ) {


    this.authService.currentOrganization.subscribe((response) => {
      if (!response || localStorage.getItem('admin_token')) return;

      window['Intercom']('boot', {
        app_id: environment.INTERCOM_ID,
        name: response.name,
        email: response.email,
        created_at: response['createdAt']
      });
    });

    if (this.authService.isLoggedIn()) {
      this.authService.renewToken();
      this.authService.fetchActiveOrganization();
    } else {
      if (!localStorage.getItem('admin_token')) {
        window['Intercom']('boot', {
          app_id: 'lc5a9e7s'
        });
      }
    }
  }
}
