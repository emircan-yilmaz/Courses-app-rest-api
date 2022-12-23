import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createUserDto } from './dto/create-user.dto';
import { updateMeDto } from './dto/update-me.dto';
import { updatePasswordDto } from './dto/update-mypassword.dto';
import { updateUserDto } from './dto/update-user.dto';
import { UserInterface } from './interface/users.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private User: Model<UserInterface>,
    private jwtService: JwtService,
  ) {}

  async getAllUsers() {
    const data = await this.User.find();

    return {
      length: data.length,
      users: data,
    };
  }

  async createUser(user: createUserDto) {
    const data = await this.User.create(user);

    return data;
  }

  async getUser(id: string) {
    const data = await this.User.findById(id);

    if (!data) throw new NotFoundException();

    return data;
  }

  async updateUser(id: string, update: updateUserDto) {
    const data = await this.User.findByIdAndUpdate(id, update, { new: true });

    if (!data) throw new NotFoundException();

    return data;
  }

  async deleteUser(id: string) {
    const data = await this.User.findByIdAndDelete(id);

    if (!data) throw new NotFoundException();
  }

  async getUserByUsername(username: string) {
    return await this.User.findOne({ username });
  }

  async updateMe(id: string, update: updateMeDto) {
    const data = await this.User.findByIdAndUpdate(id, update, {
      new: true,
    });

    const token = this.jwtService.sign({
      username: data.username,
      name: data.name,
    });

    return { token };
  }

  async updateMyPassword(update: updatePasswordDto, user: UserInterface) {
    const { oldPassword, newPassword, correctNewPassword } = update;

    const control = await bcrypt.compare(oldPassword, user.password);
    if (!control) throw new UnauthorizedException('Password is not correct');

    if (newPassword !== correctNewPassword)
      throw new BadRequestException('Please correct your new password');

    user.passwordChangedAt = new Date();
    user.password = newPassword;

    await user.save();

    const token = this.jwtService.sign({
      username: user.username,
      name: user.name,
    });

    return { token };
  }
}
