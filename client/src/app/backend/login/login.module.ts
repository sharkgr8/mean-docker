import { NgModule, ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './authguard';
import { AuthenticationService } from './auth.service';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [LoginRoutingModule, SharedModule],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})
export class LoginModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LoginModule,
      providers: [ AuthGuard, AuthenticationService ]
    };
  }
}
