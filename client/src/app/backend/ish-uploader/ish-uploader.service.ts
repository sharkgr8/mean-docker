import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { config } from '../backend.config';
import { AuthenticationService } from '../login/auth.service';
import * as Flowjs from '@flowjs/flow.js/dist/flow.min.js';
import { IFlow, IFlowFile } from 'flowjs';

@Injectable()
export class IshUploaderService {
  public token: string;
  private API: string;
  private flow: IFlow;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.authService
      .getLoggedInToken()
      .subscribe(result => (this.token = result));
    this.API = config.API_URL + '/uploader';

    this.flow = new Flowjs({
      target: this.API + '/upload',
      chunkSize: 1024 * 1024,
      testChunks: false,
      query: { upload_token: 'my_token' },
      headers: { 'x-access-token': this.token }
    });

    // Flow.js isn't supported, fall back on a different method
    if (!this.flow.support) {
      this.router.navigate(['/some-old-crappy-uploader']);
    }
  }

  getFlowObject(): IFlow {
    return this.flow;
  }

  getFiles(): IFlowFile[] {
    return this.flow.files;
  }
}
