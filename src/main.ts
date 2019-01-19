import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {create} from 'rxjs-spy';
import {CyclePlugin} from 'rxjs-spy/plugin';

if (environment.production) {
  enableProdMode();
} else {
  const spy = create();
  const cyclePlugin = spy.find(CyclePlugin);
  if (cyclePlugin) {
    spy.unplug(cyclePlugin);
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
