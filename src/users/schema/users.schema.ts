import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserRoles } from '../roles.enum';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxLength: 20,
    minLength: 3,
  },
  name: {
    type: String,
    required: true,
    maxLength: 50,
    minLength: 3,
  },
  surname: {
    type: String,
    required: true,
    maxLength: 50,
    minLength: 2,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  role: {
    type: String,
    enum: [UserRoles.ADMIN, UserRoles.INSTRUCTOR, UserRoles.USER],
    default: UserRoles.USER,
  },
  passwordChangedAt: {
    type: Date,
  },
});

UserSchema.pre('save', async function (this: any, next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

export default UserSchema;
