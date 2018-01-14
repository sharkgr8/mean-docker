import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundAdminComponent } from './404.component';
import { AuthGuard } from './login/authguard';
import { BackendComponent } from './backend.component';

const backendRoutes: Routes = [
  {
    // { path: '',   redirectTo: 'login', pathMatch: 'full' },
    path: '',
    component: BackendComponent,
    children: [
      { path: 'login', component: LoginComponent },
      {
        path: 'audio',
        loadChildren: 'app/backend/audio/audio.module#AudioModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'adminusers',
        loadChildren: 'app/backend/adminusers/adminusers.module#AdminusersModule',
        canActivate: [AuthGuard]
      },
      { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: '**', component: PageNotFoundAdminComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(backendRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class BackendAppRoutingModule {}
