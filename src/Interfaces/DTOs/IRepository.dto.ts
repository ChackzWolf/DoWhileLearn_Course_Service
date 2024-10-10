import { ICourse } from "../Models/ICourse.";


export interface UpdateCourseDTO {
  tutorId: string;
  courseCategory: string;
  courseDescription: string;
  courseLevel: string;
  coursePrice: string;
  courseTitle: string;
  demoURL: string;
  discountPrice: string;
  thumbnail: string;
  benefits_prerequisites: BenefitsPrerequisites;
  Modules: Module[];
  courseId: string;
}

export interface BenefitsPrerequisites {
  benefits: string[];
  prerequisites: string[];
}

export interface Module {
  name: string;
  description: string;
  lessons: Lesson[];
}

export interface Lesson {
  title: string;
  video: string;
  description: string;
}

export interface AddToPurchaseListResponse {
  message?:string,
  success:boolean
}

export interface ResponseFetchCourseList {
  courses: ICourse[];
}

