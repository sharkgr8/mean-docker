import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../login/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {
  @Input() loggedInUsername: string;
  @Input() isLoggedIn: boolean;

  constructor(private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/admin']);
  }

}
