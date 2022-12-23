import { Document } from 'mongoose';
import { UserRoles } from '../roles.enum';

export interface UserInterface extends Document {
  username: string;
  name: string;
  surname: string;
  password: string;
  role?: UserRoles;
  passwordChangedAt?: Date;
}
