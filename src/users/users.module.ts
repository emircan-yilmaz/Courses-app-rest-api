import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MeController } from './me.controller';
import UserSchema from './schema/users.schema';
import { UsernameGuard } from './username.guard';
import { UserController } from './users.controller';
import { UserService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController, MeController],
  providers: [UserService, UsernameGuard],
  exports: [UserService, UsernameGuard],
})
export class UsersModule {}
