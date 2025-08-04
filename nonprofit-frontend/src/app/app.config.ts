import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/errror.interceptor';
import { AppErrorHandler } from './core/error-handler.service';
import { CoreModule } from './core/core-module';
import { AuthModule } from './auth/auth-module';

// app.config.ts
// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideZoneChangeDetection({
//       eventCoalescing: true,
//       runCoalescing: true,
//     }),
//     provideRouter(routes),
//     provideHttpClient(),
//     provideAnimations(),
//     // Import module-based providers
//     importProvidersFrom(),
//   ],
//};
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor]) // Add your interceptors here
    ),
    provideAnimations(),
    { provide: ErrorHandler, useClass: AppErrorHandler }, // Moved here from CoreModule
    importProvidersFrom(CoreModule, AuthModule), // Only if CoreModule has essential providers
  ],
};
