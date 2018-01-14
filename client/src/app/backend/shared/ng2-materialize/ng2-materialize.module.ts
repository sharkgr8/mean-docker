import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MzButtonModule,
  MzInputModule,
  MzValidationModule,
  MzDatepickerModule,
  MzCheckboxModule,
  MzModalModule,
  MzIconModule,
  MzIconMdiModule,
  MzToastModule,
  MzSpinnerModule,
  MzInjectionModule
} from 'ng2-materialize';

@NgModule({
  imports: [
    CommonModule,
    MzButtonModule,
    MzInputModule,
    MzValidationModule,
    MzDatepickerModule,
    MzCheckboxModule,
    MzModalModule,
    MzIconModule,
    MzIconMdiModule,
    MzToastModule,
    MzSpinnerModule,
    MzInjectionModule
  ],
  exports: [
    CommonModule,
    MzButtonModule,
    MzInputModule,
    MzValidationModule,
    MzDatepickerModule,
    MzCheckboxModule,
    MzModalModule,
    MzIconModule,
    MzIconMdiModule,
    MzToastModule,
    MzSpinnerModule,
    MzInjectionModule
  ]
})
export class Ng2MaterializeModule {}
