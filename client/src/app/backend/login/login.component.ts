import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    // reset login status
    // this.authenticationService.logout();
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/admin']);
    }
  }

  login() {
    this.loading = true;
    this.error = '';
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(result => {
        if (result) {
          this.router.navigate(['/admin']);
        } else {
          this.error = 'Username or password is incorrect';
          this.loading = false;
        }
      });
  }
}
