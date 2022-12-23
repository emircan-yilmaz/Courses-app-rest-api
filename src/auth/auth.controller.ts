import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsernameGuard } from '../users/username.guard';
import { AuthService } from './auth.service';
import { userSignInDto } from './dto/user-signin.dto';
import { userSignUpDto } from './dto/user-signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  @UseGuards(UsernameGuard)
  singUp(@Body() user: userSignUpDto) {
    return this.authService.signUp(user);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() user: userSignInDto) {
    return this.authService.login(user);
  }
}
