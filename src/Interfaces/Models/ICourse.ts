import { Document, Types } from 'mongoose';

export type IPlainCourse = Omit<ICourse, keyof Document> & {_id?:string,averageRating?:number,ratingCount?:number};

// Types
export type MultipleChoiceQuestion = {
  id: number; 
  type: "QUIZ";
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: string;
  completedUsers:[];
};

export type CodingQuestion = {
  id: number;
  type: "CODING";
  question: string;
  startingCode: string;
  solution:string;
  difficulty:string;
  noOfParameters: number;
  parameters: { value: string; dataType: string }[];
  expectedOutput: TestOutput;
  testCases: TestCase[];
  completedUsers:[];
  hints:string[];
};

type TestCase = {
  parameters: { value: string; dataType: string }[];
  expectedValue: TestOutput;
};

type TestOutput = {
  value: string;
  dataType: string;
};

export type Question = MultipleChoiceQuestion | CodingQuestion;


export interface ILesson {
  title: string;
  video: string;
  description: string;
  questions?: Question[]
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
  _id:string
}
