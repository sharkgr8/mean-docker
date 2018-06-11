import { Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { HttpInterceptor } from '../shared/services/http-interceptor';
import { Observable } from 'rxjs';
import { config } from '../backend.config';
import { AuthenticationService } from '../login/auth.service';
import { Audio, Tag } from './audio';
import { map } from 'rxjs/operators';

@Injectable()
export class AudioService {
  public token: string;
  private API: string;
  private adminCheck: Boolean = false;

  constructor(private http: HttpInterceptor, private authService: AuthenticationService) {
    this.authService.getLoggedInToken().subscribe(result => this.token = result);
    this.authService.isAdmin().subscribe(result => this.adminCheck = result);
    this.API = config.API_URL + '/audio';
  }

  getTokenAttachedHeader(): RequestOptions {
    return new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'x-access-token': this.token
      })
    });
  }

  // 5. Function to return the Observable response containing all Audio
  getAudio(): Observable<Response> {
    return this.http.get(this.API, this.getTokenAttachedHeader());
  }
  // 6. Function to perform POST operation to create a new audio
  addAudio(audio: Audio): Observable<Response> {
    return this
      .http
      .post(this.API, audio, this.getTokenAttachedHeader());
  }
  // 7. Function to update Audio using PUT operation
  updateAudio(id: string, audio: Audio): Observable<Response> {
    return this
      .http
      .put(this.API + `/` + id, JSON.stringify(audio), this.getTokenAttachedHeader());
  }
  // 8. Function to remove the Audio using DELETE operation
  deleteAudio(id: string): Observable<Response> {
    return this
      .http
      .delete(this.API + `/` + id, this.getTokenAttachedHeader());
  }

  getAudioByName (name: string): Observable<Response> {
    return this.http.get(this.API + '/name/' + name);
  }

  requestAutocompleteItems = (text: string): Observable<Response> => {
    const url = this.API + '/tags/search/?name=' + encodeURIComponent(text);
    return this.http
        .get(url)
        .pipe(map(data => data.json()));
  }

  getPlaybackBaseUrl(id: string): string {
    return this.API + '/playback/' + id;
  }

  checkForPlaybackUrl(id: string): Observable<Response> {
    return this.http.head(this.getPlaybackBaseUrl(id));
  }
}
