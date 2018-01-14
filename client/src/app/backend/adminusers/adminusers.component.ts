import { Component, OnInit, ComponentRef, ViewChild } from '@angular/core';
import { AdminUserService } from './admin-user.service';
import { config } from '../backend.config';
import { AdminUser } from './admin-user';
import { MzToastService, MzModalService } from 'ng2-materialize';
import { MzInjectionService } from 'ng2-materialize/dist/shared/injection/injection.service';
import { AdminUsersFormComponent } from './detailForm/detailForm.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ROUTE_ANIMATION, ROUTE_ANIMATION_HOST } from '../shared/backend.routing.animation';

@Component({
  selector: 'app-adminusers',
  templateUrl: './adminusers.component.html',
  styles: [`:host {
    display: block;
    }`],
  host: ROUTE_ANIMATION_HOST, // tslint:disable-line:use-host-property-decorator
  animations: [ROUTE_ANIMATION]
})
export class AdminUsersComponent implements OnInit {
  // Declare empty list of users
  modalComponentRef: ComponentRef<AdminUsersFormComponent>;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  users: any[] = [];
  temp: any[] = [];
  isEditing = false;
  selectedUser: AdminUser = null;
  selectedUserId = '';

  constructor(private userService: AdminUserService, private toastService: MzToastService,
    private modalService: MzModalService, private injectionService: MzInjectionService) {}

  // Angular 2 Life Cycle event when component has been initialized
  ngOnInit() {
    this.userService.getUsers().subscribe(result => {
      const data = result.json();
      // cache our list
      this.temp = [...data];
      // push our inital complete list
      this.users = data;
    });
    // this.injectionService.setRootViewContainer({
    //   hostView: {
    //     rootNodes: [document.body],
    //   },
    // });
  }

  openServiceModal() {
    this.modalComponentRef = <ComponentRef<AdminUsersFormComponent>>this.modalService.open(AdminUsersFormComponent, {
      user: this.selectedUser,
      userId: this.selectedUserId,
      isEditing: this.isEditing
    });
    this.modalComponentRef.instance.onUpdateForm.subscribe((message: string) => {
      this.refresh(message);
    });
  }

  onSelect({ selected }) {
    this.isEditing = true;
    this.selectedUser = Array.isArray(selected) ? selected[0] : {};
    this.selectedUserId = (Object.keys(this.selectedUser).length === 0) ? '' : this.selectedUser._id;
    this.openServiceModal();
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
    this.users = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  showToast(message: string) {
    this.toastService.show(message, 4000, 'orange');
  }
}
