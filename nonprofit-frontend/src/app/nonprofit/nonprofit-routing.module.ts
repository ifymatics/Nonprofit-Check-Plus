import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';
import { HistoryComponent } from './history/history.component';

// const routes: Routes = [
//   { path: 'search', component: SearchComponent },
//   { path: 'results', component: ResultsComponent },
//   { path: 'history', component: HistoryComponent },
//   { path: '', redirectTo: 'search', pathMatch: 'full' },
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule],
// })
// export class NonprofitRoutingModule {}

// nonprofit-routing.module.ts
const routes: Routes = [
  {
    path: 'search',
    component: SearchComponent,
    data: { showResultsSection: true }, // Flag for template
  },
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [AuthGuard], // Protected
  },
  { path: '', redirectTo: 'search', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonprofitRoutingModule {}
