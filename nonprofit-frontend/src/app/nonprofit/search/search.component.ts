import { Component, signal } from '@angular/core';
import { NonprofitService } from '../nonprofit.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="search-layout">
      <!-- Search Options -->
      <div class="search-options">
        <button
          [class.active]="searchType === 'ein'"
          (click)="searchType = 'ein'"
        >
          Search by EIN
        </button>
        <button
          [class.active]="searchType === 'name'"
          (click)="searchType = 'name'"
        >
          Search by Name
        </button>
      </div>

      <!-- Search Input with Button -->
      <div class="search-box">
        <input
          [(ngModel)]="searchQuery"
          [placeholder]="placeholderText"
          (keyup.enter)="onSearch()"
        />
        <button class="search-button" (click)="onSearch()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 001.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 00-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 005.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
          </svg>
          Search
        </button>
      </div>

      <!-- Results Display -->
      <div class="results-area">
        @if (loading) {
        <div class="loading">
          <div class="spinner"></div>
          Searching...
        </div>
        } @else if (results()) {
        <div class="nonprofit-details">
          <div class="header-section">
            <h2>{{ results().data.organization_name }}</h2>
            <a
              [href]="results().data.pactman_org_url"
              target="_blank"
              class="profile-link"
            >
              View full profile on Pactman
            </a>
          </div>

          <div class="basic-info">
            <div class="info-row">
              <span class="label">EIN:</span>
              <span class="value">{{ results().data.ein }}</span>
            </div>
            <div class="info-row">
              <span class="label">Also known as:</span>
              <span class="value">{{
                results().data.organization_name_aka || 'N/A'
              }}</span>
            </div>
            <div class="info-row">
              <span class="label">Address:</span>
              <span class="value">
                {{ results().data.address_line1 }}<br />
                {{ results().data.city }}, {{ results().data.state }}
                {{ results().data.zip }}
              </span>
            </div>
          </div>

          <div class="section">
            <h3>IRS Status Information</h3>
            <div class="info-grid">
              <div class="info-row">
                <span class="label">IRS Subsection:</span>
                <span class="value"
                  >{{ results().data.bmf_subsection }} ({{
                    results().data.subsection_description
                  }})</span
                >
              </div>
              <div class="info-row">
                <span class="label">Foundation Type:</span>
                <span class="value">{{
                  results().data.foundation_type_description
                }}</span>
              </div>
              <div class="info-row">
                <span class="label">Ruling Date:</span>
                <span class="value"
                  >{{ results().data.ruling_month }}/{{
                    results().data.ruling_year
                  }}</span
                >
              </div>
              <div class="info-row">
                <span class="label">Exempt Status:</span>
                <span class="value">{{
                  results().data.exempt_status_code
                }}</span>
              </div>
              <div class="info-row">
                <span class="label">Most Recent BMF:</span>
                <span class="value">{{ results().data.most_recent_bmf }}</span>
              </div>
              <div class="info-row">
                <span class="label">Most Recent Pub 78:</span>
                <span class="value">{{
                  results().data.most_recent_pub78
                }}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Verification Details</h3>
            <div class="info-grid">
              <div class="info-row">
                <span class="label">Pub 78 Verified:</span>
                <span class="value">{{
                  results().data.pub78_verified ? 'Yes' : 'No'
                }}</span>
              </div>
              <div class="info-row">
                <span class="label">BMF Status:</span>
                <span class="value">{{
                  results().data.bmf_status ? 'Active' : 'Inactive'
                }}</span>
              </div>
              <div class="info-row">
                <span class="label">OFAC Status:</span>
                <span class="value">{{ results().data.ofac_status }}</span>
              </div>
              <div class="info-row">
                <span class="label">IRS Conflict:</span>
                <span class="value">{{
                  results().data.irs_bmf_pub78_conflict ? 'Yes' : 'No'
                }}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Additional Information</h3>
            <div class="info-row">
              <span class="label">Report Date:</span>
              <span class="value">{{ results().data.report_date }}</span>
            </div>
            <div class="info-row">
              <span class="label">Last Modified:</span>
              <span class="value">{{
                results().data.organization_info_last_modified
              }}</span>
            </div>
          </div>
        </div>
        } @else if (hasSearched) {
        <div class="empty-state">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
            />
          </svg>
          <p>No results found for "{{ lastSearchQuery }}"</p>
        </div>
        } @else {
        <div class="empty-state">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 001.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 00-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 005.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
          </svg>
          <p>Enter search terms above to find nonprofits</p>
        </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  searchType: 'ein' | 'name' = 'ein';
  searchQuery = '';
  loading = false;
  hasSearched = false;
  lastSearchQuery = '';
  results = signal<any>(null);

  get placeholderText(): string {
    return this.searchType === 'ein'
      ? 'Enter 9-digit EIN (e.g., 123456789)'
      : 'Enter organization name';
  }

  constructor(private nonprofitService: NonprofitService) {}

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.results.set(null);
      return;
    }

    this.loading = true;
    this.hasSearched = true;
    this.lastSearchQuery = this.searchQuery;

    const search$ =
      this.searchType === 'ein'
        ? this.nonprofitService.searchByEin(this.searchQuery)
        : this.nonprofitService.searchByName(this.searchQuery);

    search$.subscribe({
      next: (response) => {
        this.results.set(response);
      },
      error: () => {
        this.results.set(null);
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
}
