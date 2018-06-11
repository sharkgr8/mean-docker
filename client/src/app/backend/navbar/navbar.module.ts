import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BackendAppRoutingModule } from '../backend-routes.module';

import {
  MzSidenavModule,
  MzButtonModule,
  MzIconModule,
  MzIconMdiModule
} from 'ngx-materialize';
import { NavbarComponent } from './navbar.component';

@NgModule({
  imports: [CommonModule, BackendAppRoutingModule, MzSidenavModule, MzButtonModule, MzIconModule, MzIconMdiModule],
  declarations: [NavbarComponent],
  exports: [NavbarComponent, BackendAppRoutingModule]
})
export class NavbarModule {}
