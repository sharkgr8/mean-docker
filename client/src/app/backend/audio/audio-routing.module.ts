import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AudioListComponent } from './audio-list.component';

const routes: Routes = [{ path: '', component: AudioListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AudioRoutingModule { }
