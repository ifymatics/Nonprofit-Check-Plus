import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-results',
  template: `
    <div class="results-container">
      <h2>Search Results</h2>

      @if(loading){
      <div class="loading">Loading...</div>
      } @if(error){
      <div class="error">{{ error }}</div>
      } @if(result){
      <div class="result-card">
        <h3>{{ result.organizationName }}</h3>
        <p><strong>EIN:</strong> {{ result.ein }}</p>
        <p>
          <strong>Status:</strong>
          <span [class.compliant]="result.complianceStatus === 'Compliant'">
            {{ result.complianceStatus }}
          </span>
        </p>

        <div class="details">
          <h4>Details</h4>
          <ul>
            @for(detail of result.details; track detail.lael){
            <li>{{ detail.label }}: {{ detail.value }}</li>
            }
          </ul>
        </div>
      </div>
      }
    </div>
  `,
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {
  @Input() result: any;
  @Input() loading = false;
  @Input() error: string | null = null;
}
