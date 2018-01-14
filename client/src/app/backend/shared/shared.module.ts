import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2MaterializeModule } from './ng2-materialize/ng2-materialize.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MomentModule } from 'angular2-moment';
import { HttpInterceptor } from './services/http-interceptor';
import { FormatFileSizePipe } from '../ish-uploader/pipes/format-file-size.pipe';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2MaterializeModule,
    NgxDatatableModule,
    MomentModule
  ],
  declarations: [FormatFileSizePipe],
  exports: [
    CommonModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2MaterializeModule,
    NgxDatatableModule,
    MomentModule,
    FormatFileSizePipe
  ],
  providers: [HttpInterceptor]
})
export class SharedModule { }
