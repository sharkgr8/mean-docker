import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from './login/auth.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.less']
})
export class BackendComponent implements OnInit, OnDestroy {
  name: String = '';
  user: any;
  isLoggedIn: Boolean = false;
  private usernameSubscription: Subscription;
  private isloggedInSubscription: Subscription;

  constructor(private authenticationService: AuthenticationService, private ref: ChangeDetectorRef) { }

  // Angular 2 Life Cycle event when component has been initialized
  ngOnInit() {
    this.usernameSubscription = this.authenticationService.getLoggedInUserName().subscribe(result => this.name = result);
  }

  onActivate($event) {
    if (!this.isLoggedIn) {
      this.isloggedInSubscription = this.authenticationService.isLoggedIn().subscribe(
        result => {
          this.isLoggedIn = result;
          this.ref.detectChanges();
        });
    }

    if (!this.name || this.name === '') {
      this.usernameSubscription = this.authenticationService.getLoggedInUserName().subscribe(
        result => {
          this.name = result;
          this.ref.detectChanges();
        });
    }

  }

  ngOnDestroy (): void {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
    if (this.isloggedInSubscription) {
      this.isloggedInSubscription.unsubscribe();
    }
  }
}
