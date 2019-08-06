import { Component, OnInit, ElementRef ,Inject,PLATFORM_ID, Output} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { isPlatformBrowser} from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

// import * as $ from 'jquery';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  animations: [
    trigger('showMenu', [
      state('initial', style({opacity: 0})),
      state('final', style({opacity: 1})),
      transition('initial=>final', animate('600ms')),
      transition('final=>initial', animate('600ms'))
    ]),
  ]
})

export class NavigationComponentComponent implements OnInit {
  public openMenuFunction = false;
  public openMenuAccountingfirm = false;
  public openMenuMore = false;
  private openHamburger = false;
  public showPc = true;
  public min_width_menu = 900; // for hamburger menu
  public language: string = "th";
  public hamburgerStatus = false;
  public currentMenuState = 'initial';
  constructor(private element: ElementRef,
     private titleService: Title,
      @Inject(PLATFORM_ID) private platformId: Object,
       public translate: TranslateService
       , private router: Router) {

        this.language = this.translate.currentLang;
    
  }

  public switchLanguage(language: string) {
    this.translate.use(language);
    if (this.router.url.indexOf('/en') > -1) {
      const url = this.router.url.replace('en', language);
      this.router.navigate([url]);
    } else if ( this.router.url.indexOf('/th') > -1) {
      const url = this.router.url.replace('th', language);
      this.router.navigate([url]);
    } else {
      this.router.navigate(['/' + language + '/' + this.router.url]);
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
    }
  }

  ngAfterViewInit() {
  }

  public onResizeMenu($event) {
    if (isPlatformBrowser(this.platformId)) {
     
    }
  }

  openMobileMenu($this)
  {
      this.hamburgerStatus = !this.hamburgerStatus;
     
      if(this.hamburgerStatus) {
        this.openHamburger = true;
        this.currentMenuState = 'final';
       
      } else {
        this.openHamburger = false;
        this.currentMenuState = 'initial';
        
      }
  }
}
