import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
//
import { ApiTags } from '@nestjs/swagger';
import { AUTH_SERVICE } from '@app/shared';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  @Post()
  async create(@Body() dto) {
    return firstValueFrom(this.authClient.send('user_create', dto));
  }

  @Get()
  async findAll() {
    return firstValueFrom(this.authClient.send('user_find_all', {}));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return firstValueFrom(this.authClient.send('user_find_one', id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto) {
    return firstValueFrom(this.authClient.send('user_update', { id, dto }));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return firstValueFrom(this.authClient.send('user_remove', id));
  }
}
