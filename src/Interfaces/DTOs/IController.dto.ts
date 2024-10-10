export interface GetCourseInCartRequest {
    courseIds: string[];
  }
  
  export interface AddPurchasedUsersRequest {
    courseId: string;
    userId: string;
  }
  
  export interface AddPurchasedUsersResponse {
    success: boolean;
    message: string;
    status: boolean;
  }
  
  export interface RequestFetchCourseDetails {
    id: string;
  }
  
  export interface RequestFetchTutorCourse {
    tutorId: string;
  }
  
  export interface ResponseFetchCourseList {
    courses: ResponseFetchCourse[];
  }
  
  export interface EmptyRequest {}
  
  export interface VideoRequest {
    videoBinary: Uint8Array; // Using Uint8Array for bytes in TypeScript
  }
  
  export interface VideoResponse {
    success: boolean;
    message: string;
    s3Url?: string;
  }
  
  export interface ImageRequest {
    imageBinary: Buffer;
    imageName: string;
  }
  
  export interface ImageResponse {
    message: string;
    s3Url?: string;
    success: boolean;
  }
  
  export interface ResponseFetchCourse {
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
    _id: string;
    tutorId: string;
  }
  
  export interface SubmitCourseRequest {
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
  
  export interface SubmitCourseResponse {
    message: string;
    success: boolean;
  }
  