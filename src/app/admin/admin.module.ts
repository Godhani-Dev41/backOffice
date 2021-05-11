import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminUsersService } from '@app/admin/admin-users.service';
import { routes } from '@app/admin/admin.routes';
import { SharedModule } from '@app/shared.module';
import { SelectModule } from 'ng2-select';
import { AdminUserSelectPageComponent } from './admin-user-select-page/admin-user-select-page.component';

@NgModule({
  imports: [
    SelectModule,
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminUserSelectPageComponent],
  providers: [AdminUsersService]
})
export class AdminModule { }
