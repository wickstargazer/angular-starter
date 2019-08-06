import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
   providedIn: 'root'
})
export class SEOService {
   constructor(@Inject(DOCUMENT) private dom, private router: Router, private meta: Meta, private translate: TranslateService ) { }
   createCanonicalURL() {
      const link: HTMLLinkElement = this.dom.getElementById('canonicalLink');
      link.setAttribute('href', 'https://example.com' + this.router.url);
   }
}
