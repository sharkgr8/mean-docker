import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { config } from '../backend.config';

// Import rxjs map operator
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title = 'app works!';

  // Link to our api, pointing to localhost
  API = config.API_URL;

  // Declare empty list of people
  people: any[] = [];

  constructor(private http: Http) { }

  // Angular 2 Life Cycle event when component has been initialized
  ngOnInit() {
    this.getAllPeople();
  }

  // Add one person to the API
  addPerson(name, age) {
    this.http.post(`${this.API}/adminusers`, { name, age })
      .pipe(map(res => res.json()))
      .subscribe(() => {
        this.getAllPeople();
      });
  }

  // Get all users from the API
  getAllPeople() {
    this.http.get(`${this.API}/adminusers`)
      .pipe(map(res => res.json()))
      .subscribe(people => {
        console.log(people);
        this.people = people;
      });
  }
}
