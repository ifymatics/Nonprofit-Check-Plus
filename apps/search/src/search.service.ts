import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, FindOptionsOrder, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SearchHistory } from './entities/search-history.entity';
import { PactmanClient } from './pactman/pactman.client';
import { isArrayBuffer } from 'util/types';
import { KafkaProducerService } from './kafka/kafka.producer.service';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(SearchHistory)
    private repo: Repository<SearchHistory>,
    private config: ConfigService,
    private packmanClient: PactmanClient,
    //private kafkaProducer: KafkaProducerService,
  ) {}

  async searchNonprofit(input: {
    ein?: string;
    organizationName?: string;
    userId?: string;
  }) {
    console.log('HITTING SEARCHservice searchNonprofit( )method: ', input);
    try {
      const result = await this.packmanClient.search(input);
      console.log(result);

      await this.repo.save({
        query: input.ein || input.organizationName,
        result,
        userId: input.userId ? input.userId : undefined,
        bmf_status: result.data.bmf_status,
        organization_name: result.data.organization_name,
        ein: result.data.ein,
        state: result.data.state_name,
        city: result.data.pub78_city,
        pub78_verified: result.data.pub78_verified,
      });

      // await this.kafkaProducer.emit('search.verified', {
      //   ein: result?.data?.ein,
      //   name: result?.data?.organizationName,
      //   status: result?.data?.status,
      // });
      return result;
    } catch (error) {
      console.log(error.response);
    }
  }

  async getSearchHistory(page = 10, limit = 0) {
    await this.repo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getUserSearchHistory(
    options?: FindManyOptions<SearchHistory> & {
      page?: number;
      limit?: number;
      order?: string;
    },
  ): Promise<{
    data: SearchHistory[];
    meta: { total: number; page: number; limit: number };
  }> {
    // Default values
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const order =
      options?.order ||
      ({ createdAt: 'DESC' } as unknown as FindOptionsOrder<SearchHistory>);

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get data with pagination and ordering
    const [data, total] = await this.repo.findAndCount({
      ...options,
      skip,
      take: limit,
      order,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async getUserSearchHistory1(userId: string, page = 10, limit = 0) {
    const [data, total] = await this.repo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
      },
    };
  }
}
