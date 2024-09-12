import { Course } from "../courseModel";

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

interface CourseDetails {
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

interface ResponseFetchCourseList {
  courses: CourseDetails[];
}

class CourseRepository {
  // Create a course
  async createCourse(data: any): Promise<any> {
    const createdCourse = new Course(data);
    const savedCourse = await createdCourse.save();
    console.log(savedCourse, 'saved course');
    return savedCourse;
  }

  // Fetch courses
  async getCourses(): Promise<ResponseFetchCourseList> {
    const fetchCourse = await Course.find().exec(); // Use .exec() for type inference

    const formattedCourses: ResponseFetchCourseList = {
      courses: fetchCourse.map((course: any) => ({
        courseCategory: course.courseCategory,
        courseDescription: course.courseDescription,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseTitle: course.courseTitle,
        demoURL: course.demoURL,
        discountPrice: course.discountPrice,
        thumbnail: course.thumbnail,
        benefits_prerequisites: {
          benefits: course.benefits_prerequisites.benefits,
          prerequisites: course.benefits_prerequisites.prerequisites,
        },
        Modules: course.Modules.map((module: any) => ({
          name: module.name,
          description: module.description,
          lessons: module.lessons.map((lesson: any) => ({
            title: lesson.title,
            video: lesson.video,
            description: lesson.description,
          })),
        })),
      })),
    };

    return formattedCourses;
  }
}

export default CourseRepository;
