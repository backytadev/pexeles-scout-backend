import { UserRole } from '@/enums/user-role.enum';
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstNames: string;
  lastNames: string;
  roles: UserRole[];
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstNames: {
    type: String,
    required: true,
  },
  lastNames: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    enum: Object.values(UserRole),
    default: [UserRole.User],
  },
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
