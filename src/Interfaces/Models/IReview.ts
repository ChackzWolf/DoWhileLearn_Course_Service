import { Document, Types } from 'mongoose';


export interface IReview extends Document {
    courseId: Types.ObjectId;
    userId: Types.ObjectId;
    rating: number;
    helpful:number; 
    comment: string;
    createdAt: Date;
    updatedAt: Date;
  }  