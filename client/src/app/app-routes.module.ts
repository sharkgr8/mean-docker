import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found.component';

const appRoutes: Routes = [
 // { path: '',   redirectTo: 'login', pathMatch: 'full' },
  { path: '', component: AppComponent, pathMatch: 'full' },
  { path: 'admin', loadChildren: 'app/backend/backend.module#BackendModule', data: {preload: true} },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
