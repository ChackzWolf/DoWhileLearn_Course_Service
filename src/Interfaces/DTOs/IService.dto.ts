import { ICourse, IPlainCourse } from "../Models/ICourse";
import { IReview } from "../Models/IReview";


export interface UpdateCourseDTO {
  courseId:string;
  courseData: IPlainCourse
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


// DTO for video upload
export interface UploadVideoDTO {
  videoBinary: Uint8Array;
}
  
  export interface UploadVideoResponseDTO {
    success: boolean;
    message: string;
    s3Url?: string;
  }
  
  // DTO for image upload
  export interface UploadImageDTO {
    imageBinary: Buffer;
    imageName: string;
  }
  
  export interface UploadImageResponseDTO {
    success: boolean;
    message: string;
    s3Url?: string;
  }
  

  

  export interface UploadCourseResponseDTO {
    success: boolean;
    message: string;
    courseId?:string;
    courseTitle?:string;
    thumbnail?:string;
  }
  
  
  // DTO for fetching courses

  export interface FetchCourseRequestFilter {
    category:string;
    priceOrder:string;
    ratingOrder:string;
    search:string;
  }
  export interface FetchCourseResponseDTO {
    success: boolean;
    courses?: IPlainCourse[] | undefined; // Use `ICourse[]` directly here if you're expecting the full array of courses
    error?: string;
}
  
  // DTO for fetching tutor courses
  export interface FetchTutorCoursesDTO {
    tutorId: string;
  }
  
  export interface FetchTutorCoursesResponseDTO {
    success: boolean;
    courses?: IPlainCourse[] | undefined ;
    message?:string
  }
  
  // DTO for fetching course details
  export interface FetchCourseDetailsDTO {
    id: string;
  }
  
  export interface FetchCourseDetailsResponseDTO {
    courseDetails: IPlainCourse | undefined; // Assuming course detail is any for now; it should be a specific type
    reviewData?:IReview[] | any
    message?:string;
  }
  
  // DTO for adding purchased users
  export interface AddToPurchasedListDTO {
    userId: string;
    courseId: string;
  }
  
  export interface AddToPurchasedListResponseDTO {
    success: boolean;
    message: string | undefined;
    status: number;
  }
  
 // DTO for fetching courses by IDs
export interface GetCoursesByIdsDTO {
    courseIds: string[];
  }
  
  export interface GetCoursesByIdsResponseDTO {
    success: boolean;
    courses?: ICourse[];
    message?: string;
  }
  
  // Nested DTOs for course structure
  export interface BenefitsPrerequisitesDTO {
    benefits: string[];
    prerequisites: string[];
  }
  
  export interface LessonDTO {
    title: string;
    video: string;
    description: string;
  }
  
  export interface ModuleDTO {
    name: string;
    description: string;
    lessons: LessonDTO[];
  }