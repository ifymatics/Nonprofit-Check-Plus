import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';

import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @MessagePattern('user_create')
  create(@Payload() dto) {
    return this.userService.create(dto);
  }

  @MessagePattern('user_find_all')
  findAll() {
    return this.userService.findAll();
  }

  @MessagePattern('user_find_one')
  findOne(@Payload() id: string) {
    return this.userService.findOne(id);
  }

  @MessagePattern('user_update')
  update(@Payload() payload: { id: string; dto }) {
    return this.userService.update(payload.id, payload.dto);
  }

  @MessagePattern('user_remove')
  remove(@Payload() id: string) {
    return this.userService.remove(id);
  }
}
