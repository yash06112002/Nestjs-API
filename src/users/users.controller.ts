import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  addUser(@Body('name') userTitle: string) {
    const updatedUsers = this.usersService.insertUser(userTitle);
    return updatedUsers;
  }

  @Get()
  getAllProducts() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  getUser(@Param('id') userId: string) {
    return this.usersService.getSingleUser(userId);
  }

  @Post('toggle/:id')
  updateUser(@Param('id') userId: string) {
    const updatedUsers = this.usersService.updateUser(userId);
    return updatedUsers;
  }

  @Delete(':id')
  removeUser(@Param('id') userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
