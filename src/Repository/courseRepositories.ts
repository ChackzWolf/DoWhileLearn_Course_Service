import { Course } from "../courseModel";
import { ICourseRepository } from "../interface/ICourse.repository"; // Adjust import path as necessary
import { CourseDetails, ResponseFetchCourseList } from "../interface/ICourse.repository"; // Adjust import path as necessary

export default class CourseRepository implements ICourseRepository {
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

    async fetchTutorCourses(tutorId: string): Promise<ResponseFetchCourseList> {
        console.log(tutorId, 'tutorId');
        const fetchCourse = await Course.find({ tutorId });
        const formattedCourses: ResponseFetchCourseList = {
            courses: fetchCourse.map((course: any) => ({
                _id: course._id,
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

    async findCourseById(courseId: string): Promise<any> { // Adjust return type as necessary
        const courseDetails = await Course.findById(courseId);
        console.log(courseDetails, 'course details from repo');
        return courseDetails;
    }
}
