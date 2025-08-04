import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SearchService } from './search.service';

@Controller()
export class SearchController {
  constructor(private readonly service: SearchService) {}

  @MessagePattern({ cmd: 'search-nonprofit' })
  async search(
    @Payload()
    payload: {
      ein?: string;
      organizationName?: string;
      userId?: string;
    },
  ) {
    console.log('HITTING SEARCH SEARCH method: ', payload);
    const { ein, organizationName, userId } = payload;

    return this.service.searchNonprofit({ ein, organizationName, userId });
  }

  @MessagePattern({ cmd: 'search-history' })
  async getHistory() {
    return this.service.getSearchHistory();
  }

  @MessagePattern({ cmd: 'searchUser-history' })
  async getUserSearchHistory(
    @Payload()
    payload: {
      page: number;
      limit: number;
      order: 'ASC' | 'DESC';
      userId: string;
    },
  ) {
    const { limit = 10, order = 'DESC', page = 1, userId } = payload;
    const options: any = {
      page: Number(page),
      limit: Number(limit),
      order: { createdAt: order },
      userId,
    };

    options.where = [userId];

    return this.service.getUserSearchHistory(options);
  }
}
