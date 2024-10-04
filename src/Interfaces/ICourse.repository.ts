
interface Lesson {
    title: string;
    video: string;
    description: string; 
  }
  
  interface Module {
    name: string;
    description: string;
    lessons: Lesson[]; 
  }
   
  interface BenefitsPrerequisites { 
    benefits: string[];
    prerequisites: string[];
  }
  
   export interface CourseDetails {
    _id: string;
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
  }
  export interface ResponseFetchCourseList {
    courses: CourseDetails[];
  }

export interface ICourseRepository {
    createCourse(data: any): Promise<any>;
    updateCourse(data: any): Promise<any>;
    getCourses(): Promise<ResponseFetchCourseList>;
    fetchTutorCourses(tutorId: string): Promise<ResponseFetchCourseList>;
    findCourseById(courseId: string): Promise<any>; // Adjust the return type as necessary
}
