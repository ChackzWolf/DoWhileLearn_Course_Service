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
  }
  
  // DTO for fetching courses
  export interface FetchCourseResponseDTO {
    success?: boolean;
    message?: string;
    courses?: ICourse[];
  }
  
  // DTO for fetching tutor courses
  export interface FetchTutorCoursesDTO {
    tutorId: string;
  }
  
  export interface FetchTutorCoursesResponseDTO {
    success: boolean;
    courses?: ICourse[] | undefined ;
  }
  
  // DTO for fetching course details
  export interface FetchCourseDetailsDTO {
    id: string;
  }
  
  export interface FetchCourseDetailsResponseDTO {
    courseDetails: ICourse | undefined; // Assuming course detail is any for now; it should be a specific type
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
    courses?: ICourse[] | undefined;
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