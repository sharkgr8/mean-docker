import { NgModule } from '@angular/core';
import { AdminUsersComponent } from './adminusers.component';
import { AdminUsersFormComponent } from './detailForm/detailForm.component';
import { AdminUserService } from './admin-user.service';
import { AdminusersRoutingModule } from './adminusers-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    AdminusersRoutingModule,
    SharedModule
  ],
  entryComponents: [AdminUsersFormComponent],
  declarations: [AdminUsersComponent, AdminUsersFormComponent],
  providers: [ AdminUserService ]
})
export class AdminusersModule {}
