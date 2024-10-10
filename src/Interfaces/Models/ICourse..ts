import { Document, Types } from 'mongoose';

export interface ILesson {
  title: string;
  video: string;
  description: string;
}

export interface IModule {
  name: string;
  description: string;
  lessons: ILesson[];
}

export interface IBenefitsPrerequisites {
  benefits: string[];
  prerequisites: string[];
}

export interface ICourse extends Document {
  tutorId: string;
  courseCategory: string;
  courseDescription: string;
  courseLevel: string;
  coursePrice: string;
  courseTitle: string;
  demoURL: string;
  discountPrice: string;
  thumbnail: string;
  purchasedUsers: Types.ObjectId[]; // Array of ObjectId references
  benefits_prerequisites: IBenefitsPrerequisites;
  Modules: IModule[];
}
