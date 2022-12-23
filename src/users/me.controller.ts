import {
  Body,
  Controller,
  Patch,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { updateMeDto } from './dto/update-me.dto';
import { updatePasswordDto } from './dto/update-mypassword.dto';
import { UserInterface } from './interface/users.interface';
import { UsernameGuard } from './username.guard';
import { UserService } from './users.service';

@Controller('users/me')
@UseGuards(AuthGuard())
export class MeController {
  constructor(private userService: UserService) {}

  @Patch('update')
  @UsePipes(ValidationPipe)
  @UseGuards(UsernameGuard)
  updateMe(@Body() update: updateMeDto, @Req() req: { user: UserInterface }) {
    return this.userService.updateMe(req.user.id, update);
  }

  @Patch('password')
  @UsePipes(ValidationPipe)
  updateMyPassword(
    @Body() update: updatePasswordDto,
    @Req() req: { user: UserInterface },
  ) {
    return this.userService.updateMyPassword(update, req.user);
  }
}
