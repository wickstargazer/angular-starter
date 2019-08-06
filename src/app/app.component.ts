
import { Component, OnInit, ElementRef, Inject, PLATFORM_ID, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ActivationEnd} from '@angular/router';
import { isPlatformBrowser, isPlatformServer} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs/internal/Subscription';
import { DOCUMENT, makeStateKey, TransferState } from '@angular/platform-browser';
import { environment } from '../environments/environment';

const LANG_KEY = makeStateKey<string>('currentLang');
// import * as $ from 'jquery';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  public nativeElement;
  public display = 'none';
  public isHiddenFooter = false;
  public lang = 'th';
  public hideCover = false;
  routerSubscription: Subscription;

  // public defaultImage = 'https://www.placecage.com/1000/1000';

  @HostBinding('class')
  get hostClasses(): string {
    return [
      'app-root',
      this.lang // include our new one
    ].join(' ');
  }
  constructor(public element: ElementRef
    , private router: Router
    , @Inject(PLATFORM_ID) private platformId: Object
    , @Inject(DOCUMENT) private _document: any
    , public translate: TranslateService
    , private deviceService: DeviceDetectorService
    , private tstate: TransferState
    ) {

  this.translate.onLangChange.subscribe(event => this._document.documentElement.lang = event.lang);
  let lang = 'th';
    if (this.tstate.hasKey(LANG_KEY)) {
      lang = this.tstate.get(LANG_KEY, 'th');
      this.translate.setDefaultLang(lang);
      this.translate.use(lang);
    } else if ((environment.production && isPlatformServer(this.platformId))
    || (!environment.production && isPlatformBrowser(this.platformId))) {
      this.router.events.subscribe(val => {
        if (val instanceof NavigationEnd) {
          if (!val.url.startsWith('/en') && !val.url.startsWith('/th')) {
            this.translate.setDefaultLang('th');
            this.translate.use('th');
            this.tstate.set(LANG_KEY, 'th');
          }
        }
      });
      this.nativeElement = this.element.nativeElement;
      this.router.events.subscribe(val => {
        if (val instanceof NavigationEnd) {
          if (!val.url.startsWith('/en') && !val.url.startsWith('/th')) {
            this.translate.setDefaultLang('th');
            this.translate.use('th');
          } else if (val.url === '/th') {
            this.translate.setDefaultLang('th');
            this.translate.use('th');
            this.tstate.set(LANG_KEY, 'th');
          } else if (val.url === '/en') {
            this.translate.setDefaultLang('en');
            this.translate.use('en');
            this.tstate.set(LANG_KEY, 'en');
          }
        }
        if (val instanceof ActivationEnd) {
          const paramLang = val.snapshot.params['lang'];
          if (paramLang === 'th' || paramLang === 'en') {
            this.translate.setDefaultLang(paramLang);
            this.translate.use(paramLang);
            this.tstate.set(LANG_KEY, paramLang);
          }
        }
      });
    }
}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
    }
  }

}
