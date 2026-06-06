import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { icons, LucideAngularModule } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes,withRouterConfig({
        onSameUrlNavigation: 'reload'
      })),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(
      LucideAngularModule.pick(icons)
    )
  ]
};
