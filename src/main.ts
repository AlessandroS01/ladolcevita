import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from "./app/app-module.module";


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
