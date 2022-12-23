import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { UserService } from './users.service';

@Injectable()
export class UsernameGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();

    const { username } = req.body;

    const user = await this.userService.getUserByUsername(username);

    if (user) throw new BadRequestException('Username already exists');

    return true;
  }
}
