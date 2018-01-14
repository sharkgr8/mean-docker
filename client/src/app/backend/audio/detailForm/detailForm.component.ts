import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ViewChild,
  Injector
} from '@angular/core';
import { Audio, Tag, AudioFile } from '../audio';
import { AudioService } from '../audio.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AudioNameValidator } from '../../validators/duplicate-audioname-validator';
import { MzBaseModal, MzModalComponent } from 'ng2-materialize';

@Component({
  selector: 'app-audio-form',
  styleUrls: ['./detailForm.component.less'],
  templateUrl: './detailForm.component.html',
  providers: [AudioNameValidator]
})
export class AudioFormComponent extends MzBaseModal implements OnInit {
  @Input() audio: Audio;
  @Input() audioId: string;
  @Input() isEditing = false;
  @ViewChild('audioFormModal') modal: MzModalComponent;
  private readonly injector;
  @Output() onUpdateForm = new EventEmitter<string>();
  audioFile: AudioFile;

  audioForm: FormGroup;
  message: string;
  modalOptions: Materialize.ModalOptions = {
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: 0.5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '100%', // Starting top style attribute
    endingTop: '10%' // Ending top style attribute
  };

  // error messages
  errorMessageResources = {
    name: {
      minlength: 'Name must be at least 4 characters long.',
      maxlength: 'Name cannot be more than 24 characters long.',
      required: 'Name is required.'
    },
    audioFile: {
      required: 'File is required.'
    }
  };

  constructor(private audioService: AudioService, private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.createForm();
    if (this.isEditing && this.audio) {
      this.prefillForm();
    }
  }

  prefillForm() {
    this.audioForm.reset();
    this.audioForm.setValue({
      name: this.audio.name,
      audioFile: this.audio.audioFile,
      published: this.audio.published,
      tags: this.audio.tags,
      meta: {
        recordedOn: this.audio.meta.recordedOn,
        recordedAt: this.audio.meta.recordedAt
      }
    });
    // Remove password requirement for editing mode
    this.audioForm
      .get('name')
      .setAsyncValidators(
        AudioNameValidator.checkDuplicateAudioName(
          this.audioService,
          this.audio.name
        )
      );
    this.audioForm.get('name').updateValueAndValidity({
      onlySelf: true,
      emitEvent: false
    });
  }

  createForm() {
    this.audioForm = this.fb.group({
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(24)
        ]),
        AudioNameValidator.checkDuplicateAudioName(this.audioService, null)
      ],
      audioFile: [null, Validators.compose([Validators.required])],
      published: false,
      tags: [''],
      meta: this.fb.group({
        recordedOn: [''],
        recordedAt: ['']
      })
    });
  }

  requestAutocompleteItems(text: string) {
    return this.injector.view.component.audioService.requestAutocompleteItems(text);
  }

  revert() {
    this.prefillForm();
  }
  add() {
    this.audioForm.reset();
    this.isEditing = false;
  }

  delete() {
    this.audioService.deleteAudio(this.audioId).subscribe(response => {
      const res = response.json();
      this.message = res.message ? res.message : 'Unknown Error';
      this.onUpdateForm.emit(this.message);
    });
    this.modal.close();
  }

  onSubmit() {
    if (!this.audioForm.value.published || this.audioForm.value.published === null) {
      this.audioForm.value.published = false;
    }

    if (this.isEditing) {
      this.audioService
        .updateAudio(this.audioId, this.audioForm.value)
        .subscribe(response => {
          const res = response.json();
          this.message = res.message ? res.message : 'Unknown Error';
          this.onUpdateForm.emit(this.message);
        });
    } else {
      this.audioService.addAudio(this.audioForm.value).subscribe(response => {
        const res = response.json();
        this.message = res.message ? res.message : 'Unknown Error';
        this.onUpdateForm.emit(this.message);
      });
    }
    this.modal.close();
  }

  fileAdded(fileObj) {
    const file = fileObj.files[0].file;
    let audioFile = new AudioFile();
    audioFile = Object.assign({}, {
      name: file.name,
      size: file.size,
      type: file.type
    });
    this.audioForm.get('audioFile').setValue(audioFile);
  }

  getPlaybackBaseUrl(id: string): string {
    return this.audioService.getPlaybackBaseUrl(id);
  }

  // checkForPlaybackUrl(id: string): void {
  //   this.audioService.checkForPlaybackUrl(id).subscribe(response => {
  //     if (response.status !== 200) {
  //       this.audioFileError = 'Can\'t fetch audio file to stream.';
  //     }
  //   });
  // }
}
