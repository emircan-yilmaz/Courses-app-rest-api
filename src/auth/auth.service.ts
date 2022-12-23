import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from '../users/interface/users.interface';
import { UserService } from '../users/users.service';
import { userSignInDto } from './dto/user-signin.dto';
import { userSignUpDto } from './dto/user-signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(user: userSignUpDto) {
    const { password, passwordConfirm } = user;

    if (password !== passwordConfirm)
      throw new BadRequestException('Please confirm your password');

    const newUser = await this.userService.createUser(user);

    return this.sendToken(newUser);
  }

  async login(user: userSignInDto) {
    const { username, password } = user;

    const data = await this.userService.getUserByUsername(username);
    if (!data) throw new UnauthorizedException('Username or password is wrong');

    const control = await bcrypt.compare(password, data.password);
    if (!control)
      throw new UnauthorizedException('Username or password is wrong');

    return this.sendToken(data);
  }

  sendToken(user: UserInterface) {
    const token = this.jwtService.sign({
      username: user.username,
      name: user.name,
    });

    return {
      token,
    };
  }
}
