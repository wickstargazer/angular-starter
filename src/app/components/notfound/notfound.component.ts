import { Component, Inject, Injector, OnInit, PLATFORM_ID, Optional, APP_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
interface PartialResponse {
  statusMessage: string;
  status(code: number): this;
}
@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {

  constructor(
  @Inject(PLATFORM_ID) private platformId: Object,
  @Inject(APP_ID) private appId: string,
  @Optional() @Inject(RESPONSE) private response: PartialResponse) { }

  ngOnInit() {
        if (isPlatformServer(this.platformId)) {  // Only executes server side
            this.response.status(404);
            this.response.statusMessage = '404 - Page Not Found';

        }
  }

}