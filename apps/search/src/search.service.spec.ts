import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchHistory } from './entities/search-history.entity';
import { PactmanClient } from './pactman/pactman.client';

describe('SearchService', () => {
  let service: SearchService;
  let pactmanClient: PactmanClient;
  let searchHistoryModel: any;

  const mockSearchResult = [{ ein: '123456789', name: 'Test Org' }];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: PactmanClient,
          useValue: {
            search: jest.fn().mockResolvedValue(mockSearchResult),
          },
        },
        {
          provide: getModelToken(SearchHistory.name),
          useValue: {
            create: jest.fn().mockResolvedValue({}),
            find: jest.fn().mockReturnValue({
              sort: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                  exec: jest
                    .fn()
                    .mockResolvedValue([
                      { ein: '123456789', organizationName: 'Test Org' },
                    ]),
                }),
              }),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    pactmanClient = module.get<PactmanClient>(PactmanClient);
    searchHistoryModel = module.get(getModelToken(SearchHistory.name));
  });

  it('should search nonprofits and save history', async () => {
    const result = await service.searchNonprofit({
      ein: '123456789',
      organizationName: 'Test Org',
    });

    expect(pactmanClient.search).toHaveBeenCalledWith({
      ein: '123456789',
      organizationName: 'Test Org',
    });

    expect(searchHistoryModel.create).toHaveBeenCalledWith({
      ein: '123456789',
      organizationName: 'Test Org',
    });

    expect(result).toEqual(mockSearchResult);
  });

  it('should return search history', async () => {
    const history = await service.getSearchHistory();
    expect(history).toEqual([
      { ein: '123456789', organizationName: 'Test Org' },
    ]);
  });
});
