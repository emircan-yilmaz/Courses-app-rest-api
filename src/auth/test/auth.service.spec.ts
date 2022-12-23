import { forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../../users/users.module';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { jwtConstants } from '../constants';
import { JwtStrategy } from '../jwt.strategy';
import { RolesGuard } from '../roles.guard';
import { MongooseModule } from '@nestjs/mongoose';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(jwtConstants.DATABASE),
        forwardRef(() => AuthModule),
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: jwtConstants.expiresIn },
        }),
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
        UsersModule,
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy, RolesGuard],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('Login', () => {
    it('should login', async () => {
      const dto = {
        username: 'instructor',
        password: 'test1234',
      };
      expect(await authService.login(dto)).toStrictEqual({
        token: expect.any(String),
      });
    });
  });

  describe('Sign up', () => {
    function generateString(length) {
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = ' ';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        );
      }

      return result;
    }

    it('should sign up user', async () => {
      const dto = {
        username: generateString(4),
        name: 'emir',
        surname: 'can',
        password: 'test1234',
        passwordConfirm: 'test1234',
      };
      expect(await authService.signUp(dto)).toStrictEqual({
        token: expect.any(String),
      });
    });
  });
});
