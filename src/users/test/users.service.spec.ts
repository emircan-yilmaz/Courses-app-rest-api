import { forwardRef } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { jwtConstants } from '../../auth/constants';
import { MongooseModule } from '@nestjs/mongoose';
import generateString from '../../utils';
import { UserService } from '../users.service';
import UserSchema from '../schema/users.schema';
import { UserController } from '../users.controller';
import { createUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthModule } from '../../auth/auth.module';
import { MeController } from '../me.controller';
import { updateUserDto } from '../dto/update-user.dto';
import { updateMeDto } from '../dto/update-me.dto';
import { updatePasswordDto } from '../dto/update-mypassword.dto';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(jwtConstants.DATABASE),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        forwardRef(() => AuthModule),
      ],
      controllers: [UserController, MeController],
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('Get User', () => {
    it('should get user', async () => {
      const id = '62d7becc541181ece66edeb2';
      const response = await userService.getUser(id);
      expect(response.id).toEqual(id);
    });
    it('should not get a user, user id does not exist', async () => {
      const id = '62d933f8e96aad5f8dda6baa';
      let err = 0;
      try {
        await userService.getUser(id);
      } catch (error) {
        err = 1;
      }
      expect(err).toEqual(1);
    });
    it('should get all users', async () => {
      const response = await userService.getAllUsers();
      expect(response.results).toEqual(response.users.length);
    });
  });

  describe('Create User', () => {
    it('should create user', async () => {
      const userInfo = generateString(5);
      const user: createUserDto = {
        username: userInfo,
        name: userInfo,
        surname: userInfo,
        password: 'test1234',
      };
      const response = await userService.createUser(user);
      const pass = await bcrypt.compare('test1234', response.password);
      const control = {
        username: response.username,
        pass,
      };
      expect(control).toStrictEqual({
        username: user.username,
        pass: true,
      });
    });
    it('should not create user, one required area is missing', async () => {
      let err = 0;
      const userInfo = generateString(5);
      const user: createUserDto = {
        username: userInfo,
        name: undefined,
        surname: userInfo,
        password: 'test1234',
      };
      try {
        await userService.createUser(user);
      } catch (error) {
        err = 1;
      }
      expect(err).toEqual(1);
    });
  });

  describe('Update User', () => {
    it('should update user', async () => {
      const id = '63937cd245265cc01cebd128';
      const userInfo = generateString(5);
      const update: updateUserDto = {
        name: userInfo,
        surname: userInfo,
      };
      const response = await userService.updateUser(id, update);
      const control = {
        id: response.id,
        name: response.name,
        surname: response.surname,
      };
      expect(control).toStrictEqual({
        id,
        name: update.name,
        surname: update.surname,
      });
    });

    it('should not update user, user does not exist', async () => {
      let err = 0;

      const id = '62d7307ea971a838920d0daa';
      const userInfo = generateString(5);
      const update = {
        name: userInfo,
      };

      try {
        await userService.updateUser(id, update);
      } catch (error) {
        err = 1;
      }

      expect(err).toEqual(1);
    });
  });

  describe('Delete Course', () => {
    it('should delete user', async () => {
      const userInfo = generateString(5);

      const user: createUserDto = {
        username: userInfo,
        name: userInfo,
        surname: userInfo,
        password: 'test1234',
      };

      const response = await userService.createUser(user);
      const deleted = await userService.deleteUser(response.id);
      expect(deleted).toBe(undefined);
    });
  });

  describe('Update Me', () => {
    it('should update me', async () => {
      const id = '63937cd245265cc01cebd128';
      const userInfo = generateString(5);
      const update: updateMeDto = {
        name: userInfo,
        surname: userInfo,
      };

      expect(await userService.updateMe(id, update)).toStrictEqual({
        token: expect.any(String),
      });
    });

    it('should update my password', async () => {
      const id = '63937cd245265cc01cebd128';
      const update: updatePasswordDto = {
        oldPassword: 'test1234',
        newPassword: 'test1234',
        correctNewPassword: 'test1234',
      };

      const user = await userService.getUser(id);

      expect(await userService.updateMyPassword(update, user)).toStrictEqual({
        token: expect.any(String),
      });
    });
  });
});
