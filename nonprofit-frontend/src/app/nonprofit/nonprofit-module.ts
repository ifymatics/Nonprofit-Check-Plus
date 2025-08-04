import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';
import { HistoryComponent } from './history/history.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, SearchComponent, ResultsComponent, HistoryComponent],
})
export class NonprofitModule {}
