import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

// Import rxjs map operator
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'app works!';

  // Link to our api, pointing to localhost
  API = 'http://127.0.0.1:3000';
  // API = 'http://192.168.2.5:3000';

  // Declare empty list of people
  people: any[] = [];

  constructor(private http: Http) {}

  // Angular 2 Life Cycle event when component has been initialized
  ngOnInit() {
    this.getAllPeople();
  }

  // Add one person to the API
  addPerson(name, age) {
    this.http.post(`${this.API}/adminusers`, {name, age})
    .pipe(
      map(res => res.json()))
      .subscribe(() => {
        this.getAllPeople();
      });
  }

  // Get all users from the API
  getAllPeople() {
    this.http.get(`${this.API}/adminusers`)
    .pipe(
      map(res => res.json()))
      .subscribe(people => {
        this.people = people;
      });
  }
}
