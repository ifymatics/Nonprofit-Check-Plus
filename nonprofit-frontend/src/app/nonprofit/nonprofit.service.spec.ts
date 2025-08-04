import { TestBed } from '@angular/core/testing';

import { NonprofitService } from './nonprofit.service';

describe('NonprofitService', () => {
  let service: NonprofitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NonprofitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
