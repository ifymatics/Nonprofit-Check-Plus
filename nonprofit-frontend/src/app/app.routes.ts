// import { Routes } from '@angular/router';
// import { AuthGuard } from './auth/auth.guard';

// export const routes: Routes = [
//   {
//     path: 'auth',
//     loadChildren: () =>
//       import('./auth/auth-routing.module').then((m) => m.AuthRoutingModule),
//   },
//   {
//     path: '',
//     loadChildren: () =>
//       import('./nonprofit/nonprofit-routing.module').then(
//         (m) => m.NonprofitRoutingModule
//       ),
//     canActivate: [AuthGuard],
//   },
//   { path: '**', redirectTo: 'auth' },
// ];
import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  // Public routes (no auth required)
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },

  // Protected routes (require auth)
  {
    path: '',
    loadChildren: () =>
      import('./nonprofit/nonprofit-routing.module').then(
        (m) => m.NonprofitRoutingModule
      ),
    canActivate: [AuthGuard],
  },

  // Redirects
  { path: 'auth', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }, // 404 goes to login
];
