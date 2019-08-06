import { AppModule } from './app.module';
import {ModuleMapLoaderModule} from '@nguniversal/module-map-ngfactory-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { NgModule } from '@angular/core';
import { ServerTransferStateModule } from '@angular/platform-server';
import { ServerModule } from '@angular/platform-server';
import { Observable } from 'rxjs/internal/Observable';
import { Observer } from 'rxjs/internal/types';
import { TransferState, StateKey, makeStateKey } from '@angular/platform-browser';

let fs = require('fs');

export class TranslateServerLoader implements TranslateLoader {

    constructor(private prefix: string = 'i18n',
        private suffix: string = '.json',
        private transferState: TransferState) {
    }

    public getTranslation(lang: string): Observable<any> {

        return Observable.create(observer => {
            const jsonData = JSON.parse(fs.readFileSync(`./dist/browser/assets/i18n/${lang}.json`, 'utf8'));

            // Here we save the translations in the transfer-state
            const key: StateKey<number> = makeStateKey<number>('transfer-translate-' + lang);
            this.transferState.set(key, jsonData);

            observer.next(jsonData);
            observer.complete();
        });
    }
}
export function translateFactory(transferState: TransferState) {
    return new TranslateServerLoader('/assets/i18n', '.json', transferState);
}

@NgModule({
    declarations: [],
    imports: [
        // Make sure the string matches
        AppModule,
        ServerModule,
        ModuleMapLoaderModule,
        ServerTransferStateModule,
        TranslateModule.forRoot({
            loader: {provide: TranslateLoader, useFactory: translateFactory, deps: [TransferState]}
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class ServerAppModule {}
