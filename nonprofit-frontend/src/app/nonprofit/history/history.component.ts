import { Component, OnInit } from '@angular/core';
import { NonprofitService } from '../nonprofit.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

type NonProfitData = {
  bmf_status: boolean;
  city: string;
  createdAt: string;
  ein: string;
  organization_name: string;
  pub78_verified: string;
  query: string;
  result: any;
  state_name: null | string;
  userId: string;
};
type HistoryDtaa = {
  data: NonProfitData[];
};
@Component({
  selector: 'app-history',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="history-container">
      <h2>Search History</h2>

      <div class="history-cards">
        <div class="card" *ngFor="let item of paginatedHistory">
          <div class="card-header">
            <h3>
              {{ item.organization_name || item.pub78_organization_name }}
            </h3>
            <span class="date">{{ item.createdAt | date : 'medium' }}</span>
          </div>

          <div class="card-body">
            <div class="card-row">
              <span class="label">EIN:</span>
              <span class="value">{{ item.ein || item.pub78_ein }}</span>
            </div>

            <div class="card-row">
              <span class="label">Status:</span>
              <span class="value">{{ item.bmf_status || 'N/A' }}</span>
            </div>

            <div class="card-row">
              <span class="label">Location:</span>
              <span class="value"
                >{{ item.city }}, {{ item.state_name || item.state }}</span
              >
            </div>

            <div class="card-row">
              <span class="label">Last Updated:</span>
              <span class="value">{{
                item.organization_info_last_modified | date : 'medium'
              }}</span>
            </div>
          </div>

          <div class="card-actions">
            <button (click)="repeatSearch(item)">Search Again</button>
            <a
              [href]="item.pactman_org_url"
              target="_blank"
              class="profile-link"
              >View Profile</a
            >
          </div>
        </div>
      </div>
      <div class="pagination-controls">
        <button (click)="prevPage()" [disabled]="currentPage === 1">
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button (click)="nextPage()" [disabled]="currentPage === totalPages">
          Next
        </button>
        <select [(ngModel)]="itemsPerPage" (change)="updatePagination()">
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
        </select>
      </div>
      <div *ngIf="loading" class="loading-spinner">Loading...</div>
    </div>
  `,
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  history = {} as HistoryDtaa;
  paginatedHistory: any[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(private nonprofitService: NonprofitService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.nonprofitService.getSearchHistory().subscribe({
      next: (data: any) => {
        console.log(data);
        this.history = data;
        this.updatePagination();
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        return (this.loading = false);
      },
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.history.data.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedHistory = this.history.data.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  repeatSearch(item: any): void {
    // Implement search again functionality
    console.log('Repeat search for:', item);
  }
}
