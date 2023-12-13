import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

// bootstrapApplication(AppComponent, {
//   providers: [
//     { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
//     importProvidersFrom(IonicModule.forRoot({})),
//     importProvidersFrom(HttpClientModule),
//     importProvidersFrom(IonicStorageModule.forRoot()),
//     //provideRouter(routes),
//   ],
// });
