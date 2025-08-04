// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { LoginComponent } from './login/login.component';
// import { RegisterComponent } from './register/register.component';

// import { AuthGuard } from './auth.guard';

// const routes: Routes = [
//   {
//     path: 'login',
//     component: LoginComponent,
//     data: {
//       title: 'Login',
//       animation: 'loginPage',
//     },
//   },
//   {
//     path: 'register',
//     component: RegisterComponent,
//     data: {
//       title: 'Register',
//       animation: 'registerPage',
//     },
//   },

//   {
//     path: '',
//     redirectTo: 'login',
//     pathMatch: 'full',
//   },
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule],
// })
// export class AuthRoutingModule {}
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login',
      animation: 'loginPage',
    },
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register',
      animation: 'registerPage',
    },
  },
  // Add this to handle the base /auth path
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
