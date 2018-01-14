import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IshUploaderComponent } from './ish-uploader-component/ish-uploader-component';
import { SharedModule } from '../shared/shared.module';
import { IshUploaderService } from './ish-uploader.service';
import { FormatUploadTimePipe } from './pipes/format-upload-time.pipe';
import { FormatUploadProgressPipe } from './pipes/format-upload-progress.pipe';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [IshUploaderComponent],
  declarations: [IshUploaderComponent, FormatUploadTimePipe, FormatUploadProgressPipe],
  providers: [IshUploaderService]
})
export class IshUploaderModule { }
