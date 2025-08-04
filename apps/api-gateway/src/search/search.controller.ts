import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { Request } from 'express';

import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard, JwtAuthOrNullGuard, SEARCH_SERVICE } from '@app/shared';

@Controller('nonprofits')
export class SearchController {
  constructor(
    @Inject(SEARCH_SERVICE)
    private readonly nonprofitServiceClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthOrNullGuard)
  @Get('search/ein/:ein')
  async search(@Param('ein') ein: string, @Req() req) {
    console.log('HITTING API-GATEWAY SEARCH method: ', ein);
    const payload = { ein: ein, userId: req.user.id };
    return firstValueFrom(
      this.nonprofitServiceClient.send({ cmd: 'search-nonprofit' }, payload),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getHistory() {
    return firstValueFrom(
      this.nonprofitServiceClient.send({ cmd: 'searchUser-history' }, {}),
    );
  }
}
