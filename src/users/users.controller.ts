import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AllowedRoles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { UserRoles } from './roles.enum';
import { UsernameGuard } from './username.guard';
import { UserService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
@AllowedRoles([UserRoles.ADMIN])
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post()
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  @UseGuards(UsernameGuard)
  createUser(@Body() user: createUserDto) {
    return this.userService.createUser(user);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  @UseGuards(UsernameGuard)
  updateUser(@Param('id') id: string, @Body() update: updateUserDto) {
    return this.userService.updateUser(id, update);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
