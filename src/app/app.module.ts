/* style */
import { NgModule } from '@angular/core';
import { BrowserModule, TransferState, StateKey, makeStateKey } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NavigationComponentComponent } from './navigation/navigation.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CoreModule, HttpLoaderFactory } from './core.module';
import { HttpClient } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { APP_BASE_HREF } from '@angular/common';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { PipeTransform, Pipe } from '@angular/core';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { Observable } from 'rxjs';
// lazy load image

export class TranslateBrowserLoader implements TranslateLoader {
  constructor(private prefix: string = 'i18n',
              private suffix: string = '.json',
              private transferState: TransferState,
              private http: HttpClient) {
  }
  public getTranslation(lang: string): Observable<any> {

    const key: StateKey<number> = makeStateKey<number>('transfer-translate-' + lang);
    const data = this.transferState.get(key, null);

    // First we are looking for the translations in transfer-state, if none found, http load as fallback
    if (data) {
      return Observable.create(observer => {
        observer.next(data);
        observer.complete();
      });
    } else {
      return new TranslateHttpLoader(this.http, this.prefix, this.suffix).getTranslation(lang);
    }
  }
}

export function exportTranslateStaticLoader(http: HttpClient, transferState: TransferState) {
    return new TranslateBrowserLoader('/assets/i18n/', '.json', transferState, http);
 }

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'flowadvance-frontend' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, TransferState]
      }
    }),
    CoreModule.forRoot(),
    TransferHttpCacheModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    NavigationComponentComponent,
    NotfoundComponent
  ],
  providers: [
    CookieService,
    {
      provide: APP_BASE_HREF,
      useValue: environment.baseHref
    },
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
