// import { Component } from '@angular/core';

// import { Router, RouterModule } from '@angular/router';
// import { AuthService } from '../../shared/auth.service';
// import { AsyncPipe, CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-header',
//   imports: [CommonModule, RouterModule, AsyncPipe],
//   standalone: true,
//   template: `
//     <header class="app-header">
//       <div class="container">
//         <h1 class="logo">Nonprofit Check</h1>
//         <nav class="main-nav">
//           <ul>
//             <li>
//               <a routerLink="/search" routerLinkActive="active">Search</a>
//             </li>
//             <li>
//               <a routerLink="/history" routerLinkActive="active">History</a>
//             </li>
//             @if ((auth.currentUser$ | async)?.role === 'admin') {
//             <li>
//               <a routerLink="/admin" routerLinkActive="active">Admin</a>
//             </li>
//             }
//           </ul>
//         </nav>
//         <div class="auth-section">
//           <span *ngIf="auth.currentUser$ | async as user">
//             Welcome, {{ user.email }}!
//           </span>
//           <button (click)="onLogout()">Logout</button>
//         </div>
//       </div>
//     </header>
//   `,
//   styleUrls: ['./header.component.scss'],
// })
// export class HeaderComponent {
//   constructor(public auth: AuthService, private router: Router) {}

//   onLogout(): void {
//     this.auth.logout().subscribe(() => {
//       this.router.navigate(['/login']);
//     });
//   }
// }

import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, AsyncPipe],
  standalone: true,
  template: `
    <header class="app-header">
      <div class="container">
        <h1 class="logo">Nonprofit Check</h1>
        <div class="nav-container">
          <nav class="main-nav">
            <ul>
              <li>
                <a
                  routerLink="/search"
                  routerLinkActive="active"
                  class="nav-button"
                  >Search</a
                >
              </li>
              <li>
                <a
                  routerLink="/history"
                  routerLinkActive="active"
                  class="nav-button"
                  >History</a
                >
              </li>
              @if ((auth.currentUser$ | async)?.role === 'admin') {
              <li>
                <a
                  routerLink="/admin"
                  routerLinkActive="active"
                  class="nav-button"
                  >Admin</a
                >
              </li>
              }
            </ul>
          </nav>
          <div class="auth-section">
            <span
              *ngIf="auth.currentUser$ | async as user"
              class="welcome-message"
            >
              Welcome, {{ user.email }}!
            </span>
            <button class="logout-button" (click)="onLogout()">Logout</button>
          </div>
        </div>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(public auth: AuthService, private router: Router) {}

  onLogout(): void {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
