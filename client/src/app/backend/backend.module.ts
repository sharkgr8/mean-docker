import { NgModule } from '@angular/core';
import { PageNotFoundAdminComponent } from './404.component';
import { BackendComponent } from './backend.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarModule } from './navbar/navbar.module';
import { LoginModule } from './login/login.module';
import { AdminusersModule } from './adminusers/adminusers.module';
import { AudioModule } from './audio/audio.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [BackendComponent, DashboardComponent, PageNotFoundAdminComponent],
  imports: [LoginModule.forRoot(), SharedModule, NavbarModule, AdminusersModule, AudioModule],
  bootstrap: [BackendComponent]
})
export class BackendModule {}
