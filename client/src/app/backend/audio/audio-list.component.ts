import { Component, OnInit, ComponentRef, ViewChild } from '@angular/core';
import { AudioService } from './audio.service';
import { config } from '../backend.config';
import { Audio, Tag } from './audio';
import { MzToastService, MzModalService } from 'ng2-materialize';
import { MzInjectionService } from 'ng2-materialize/dist/shared/injection/injection.service';
import { AudioFormComponent } from './detailForm/detailForm.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ROUTE_ANIMATION, ROUTE_ANIMATION_HOST } from '../shared/backend.routing.animation';

// Import rxjs map operator
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-audio-list',
  templateUrl: './audio-list.component.html',
  styles: [`:host {
    display: block;
    }`],
  host: ROUTE_ANIMATION_HOST, // tslint:disable-line:use-host-property-decorator
  animations: [ROUTE_ANIMATION]
})
export class AudioListComponent implements OnInit {
  modalComponentRef: ComponentRef<AudioFormComponent>;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  audio: any[] = [];
  temp: any[] = [];
  isEditing = false;
  selectedAudio: Audio = null;
  selectedAudioId = '';

  constructor(private audioService: AudioService, private toastService: MzToastService,
    private modalService: MzModalService, private injectionService: MzInjectionService) {}

  // Angular 2 Life Cycle event when component has been initialized
  ngOnInit() {
    this.audioService.getAudio().subscribe(result => {
      const data = result.json();
      // cache our list
      this.temp = [...data];
      // push our inital complete list
      this.audio = data;
    });
  }

  openServiceModal() {
    this.modalComponentRef = <ComponentRef<AudioFormComponent>>this.modalService.open(AudioFormComponent, {
      audio: this.selectedAudio,
     // audioId: this.selectedAudioId,
      isEditing: this.isEditing
    });
    this.modalComponentRef.instance.onUpdateForm.subscribe((message: string) => {
      this.refresh(message);
    });
  }

  onSelect({ type, event, row }) {
    if (type === 'dblclick') {
      this.isEditing = true;
      this.selectedAudio = row || {};
      this.selectedAudioId = (Object.keys(this.selectedAudio).length === 0) ? '' : this.selectedAudio._id;
      this.openServiceModal();
    }
  }

  add() {
    this.openServiceModal();
  }

  refresh(message) {
    this.ngOnInit();
    this.showToast(message);
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.audio = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  showToast(message: string) {
    this.toastService.show(message, 4000, 'orange');
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  getPlaybackBaseUrl(id: string): string {
    return this.audioService.getPlaybackBaseUrl(id);
  }

  getRowHeight(row) {
    // set default
    if (!row) { return 50; }

    // return my height
    return row.height;
  }
}
