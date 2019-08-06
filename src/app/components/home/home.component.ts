import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID, AfterViewInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { SEOService } from '../../seo-service';
import { Title } from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs/internal/Subscription';
declare const gaTrackEvent;
@Component({
  selector: 'app-home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  public language: any;
  protected langchangeSubscription: Subscription;
  constructor(
    protected router: Router,
    protected element: ElementRef,
    @Inject(PLATFORM_ID) protected platformId: Object,
    public translate: TranslateService,
    protected titleService: Title,
    protected deviceService: DeviceDetectorService,
    protected seoService: SEOService,
    ) {
      this.titleService.setTitle(this.translate.instant('metatitle'));
      this.language = translate.currentLang;
      this.langchangeSubscription = this.translate.onLangChange.subscribe(event => {
        this.titleService.setTitle(this.translate.instant('metatitle'));
        this.language = translate.currentLang;
      });
  }
  ngOnDestroy() {
    this.langchangeSubscription.unsubscribe();
  }
  ngOnInit() {
    this.seoService.createCanonicalURL();
  }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
    }
  }
}
