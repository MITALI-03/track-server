const bcrypt = require('bcrypt');
import mongoose, { Document, Schema, Model, Error } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre<IUser>('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error: any) {
    return next(error);
  }
});

userSchema.methods.comparePassword = function (candidatePassword:string) {
  const user = this;
  return new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err: Error, isMatch: boolean) => {
      if (err) {
        return reject(err);
      }
      resolve(isMatch);
    });
  });
};

export const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);

