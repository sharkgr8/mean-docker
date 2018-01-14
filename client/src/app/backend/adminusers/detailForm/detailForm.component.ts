import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { AdminUser } from '../admin-user';
import { AdminUserService } from '../admin-user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatchPassword } from '../../validators/password-validator';
import { UsernameValidator } from '../../validators/duplicate-username-validator';
import { Subscription } from 'rxjs/Subscription';
import { MzBaseModal, MzModalComponent } from 'ng2-materialize';

@Component({
  selector: 'app-adminusers-form',
  styleUrls: ['./detailForm.component.css'],
  templateUrl: './detailForm.component.html',
  providers: [ UsernameValidator ]
})
export class AdminUsersFormComponent extends MzBaseModal implements OnInit, OnDestroy  {
  @Input() user: AdminUser;
  @Input() userId: string;
  @Input() isEditing = false;
  @ViewChild('userFormModal') modal: MzModalComponent;
  @Output() onUpdateForm = new EventEmitter<string>();

  checkboxSubscription: Subscription;
  userForm: FormGroup;
  message: string;
  modalOptions: Materialize.ModalOptions = {
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '100%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
  };

  // error messages
  errorMessageResources = {
    name: {
      minlength: 'Name must be at least 4 characters long.',
      maxlength: 'Name cannot be more than 24 characters long.',
      required: 'Name is required.',
    },
    password: {
      minlength: 'Password must be at least 1 characters long.',
      required: 'Password is required.',
    },
    confirmPassword: {
      required: 'Confirm Password is required.',
      MatchPassword: 'Password doesn\'t match'
    },
    username: {
      minlength: 'Username must be at least 4 characters long.',
      maxlength: 'Username cannot be more than 12 characters long.',
      required: 'Username is required.',
      checkDuplicateUsername: 'Username is already taken.'
    },
    email: {
      required: 'Email is required.',
      email: 'Invalid format'
    },
    phone: {
      pattern: 'Phone number should be 10 digits long',
    }
  };

  constructor(private userService: AdminUserService, private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.createForm();
    if (this.isEditing && this.user) {
      this.prefillForm();
    }
  }

  ngOnDestroy() {
    this.removeCheckboxSubscription();
  }

  prefillForm() {
    this.userForm.reset();
    this.userForm.setValue({
      name: this.user.name,
      username: this.user.username,
      checkPassword: false,
      password: '',
      confirmPassword: '',
      admin: this.user.admin,
      meta: {
        email: this.user.meta.email,
        phone: this.user.meta.phone
      }
    });
    // Remove password requirement for editing mode
    this.userForm.get('username').setAsyncValidators(UsernameValidator.checkDuplicateUsername(this.userService, this.user.username));
    this.userForm
      .get('username')
      .updateValueAndValidity({
        onlySelf: true,
        emitEvent: false
      });
    this.userForm.get('password').disable();
    this.userForm.get('confirmPassword').disable();
    this.initCheckboxSubscription();
  }

  createForm() {
    this.userForm = this.fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(24),
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(12),
      ]), UsernameValidator.checkDuplicateUsername(this.userService, null)],
      checkPassword: [false],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1)
      ])],
      confirmPassword: ['', Validators.compose([
        Validators.required,
        MatchPassword('password')
      ])],
      admin: false,
      meta: this.fb.group({
        email: ['', Validators.compose([
          Validators.required,
          Validators.email
        ])],
        phone: ['', [Validators.pattern('^([0-9]( |-)?)?(\\(?[0-9]{3}\\)?|[0-9]{3})( |-)?([0-9]{3}( |-)?[0-9]{4}|[a-zA-Z0-9]{7})')]]
      })
    });
  }

  initCheckboxSubscription() {
    if (!this.checkboxSubscription) {
      this.checkboxSubscription = this.userForm.get('checkPassword').valueChanges.subscribe((checked: boolean) => {
        if (checked) {
          this.userForm.get('password').enable();
          this.userForm.get('confirmPassword').enable();
        } else {
          this.userForm.get('password').disable();
          this.userForm.get('confirmPassword').disable();
        }
      });
    }
  }

  removeCheckboxSubscription() {
    if (this.checkboxSubscription && !this.checkboxSubscription.closed) {
      this.checkboxSubscription.unsubscribe();
    }
  }

  revert() { this.prefillForm(); }
  add() {
    this.userForm.reset();
    this.isEditing = false;
    this.removeCheckboxSubscription();
    this.userForm.get('password').enable();
    this.userForm.get('confirmPassword').enable();
  }

  delete() {
      this.userService
      .deleteUser(this.userId)
      .subscribe(response => {
        const res = response.json();
        this.message = (res.message) ? res.message : 'Unknown Error';
        this.onUpdateForm.emit(this.message);
      }
    );
    this.modal.close();
  }

  onSubmit() {
    if (!this.userForm.value.admin || this.userForm.value.admin === null) {
      this.userForm.value.admin = false;
    }

    if (!this.userForm.value.checkPassword || this.userForm.value.checkPassword === null) {
      this.userForm.value.checkPassword = false;
    }

    if (this.isEditing) {
      this.userService
        .updateUser(this.userId, this.userForm.value)
        .subscribe(response => {
          const res = response.json();
          this.message = (res.message) ? res.message : 'Unknown Error';
          this.onUpdateForm.emit(this.message);
        }
      );
    } else {
      this.userService.addUser(this.userForm.value).subscribe(
        response => {
          const res = response.json();
          this.message = (res.message) ? res.message : 'Unknown Error';
          this.onUpdateForm.emit(this.message);
        }
      );
    }
    this.modal.close();
  }
}
