import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { CommonModule } from '@angular/common';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        // AlertModule.forRoot(),
        LazyLoadImageModule,
        TransferHttpCacheModule,
        HttpClientModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: false
        }),
        DeviceDetectorModule.forRoot(),
        DeferLoadModule
    ],
    exports: [
        TranslateModule,
        DeferLoadModule,
        HttpClientModule,
        TransferHttpCacheModule,
        LazyLoadImageModule
    ]
})
export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: []
        };
    }
}
