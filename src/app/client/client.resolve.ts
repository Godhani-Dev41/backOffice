import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AuthenticationService } from '../shared/services/auth/authentication.service';

@Injectable()
export class ClientResolve implements Resolve<any> {
  constructor(
    private authService: AuthenticationService
  ) {

  }

  resolve() {
    return this.authService.fetchActiveOrganization();
  }
}
