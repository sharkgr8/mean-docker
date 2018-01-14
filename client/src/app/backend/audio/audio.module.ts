import { NgModule } from '@angular/core';
import { AudioListComponent } from './audio-list.component';
import { AudioFormComponent } from './detailForm/detailForm.component';
import { AudioService } from './audio.service';
import { AudioRoutingModule } from './audio-routing.module';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '../shared/shared.module';
import { IshUploaderModule } from '../ish-uploader/ish-uploader.module';
import { AudioPlayerComponent } from '../shared/audio-player/audio-player.component';

@NgModule({
  imports: [AudioRoutingModule, SharedModule, TagInputModule, IshUploaderModule],
  declarations: [AudioListComponent, AudioFormComponent, AudioPlayerComponent],
  entryComponents: [AudioFormComponent],
  providers: [AudioService]
})
export class AudioModule {}
