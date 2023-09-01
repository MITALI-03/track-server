import { Document, Schema, Model, model, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
}

interface IPoint {
  timestamp: number;
  coords: {
    latitude: number;
    longitude: number;
    altitude: number;
    accuracy: number;
    heading: number;
    speed: number;
  };
}

const pointSchema = new Schema<IPoint>({
  timestamp: Number,
  coords: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    accuracy: Number,
    heading: Number,
    speed: Number,
  },
});

const trackSchema = new Schema<IUser>({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    default: '',
  },
  locations: [pointSchema],
} as Record<string, any>); // Add this line to bypass TypeScript error

const TrackModel: Model<IUser> = model<IUser>('Track', trackSchema);

export default TrackModel;
