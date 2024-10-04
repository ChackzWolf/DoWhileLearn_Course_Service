import { Course } from "../courseModel";
import { ICourseRepository } from "../Interfaces/ICourse.repository"; // Adjust import path as necessary
import { CourseDetails, ResponseFetchCourseList } from "../Interfaces/ICourse.repository"; // Adjust import path as necessary
import mongoose from 'mongoose';


export default class CourseRepository implements ICourseRepository {
    // Create a course
    async createCourse(data: any): Promise<any> {
        const createdCourse = new Course(data);
        const savedCourse = await createdCourse.save();
        console.log(savedCourse, 'saved course');
        return savedCourse;
    }

        // Create a course
        async updateCourse(data: any): Promise<any> {
            const updatedCourse = await Course.findByIdAndUpdate(data.courseId, data, { new: true, runValidators: true });
            console.log(updatedCourse, 'updated course');
            return updatedCourse; 
        }

 

    // Fetch courses
    async getCourses(): Promise<ResponseFetchCourseList> {
        const fetchCourse = await Course.find().exec(); // Use .exec() for type inference

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


    async addToPurchaseList(userId: string, courseId: string):Promise<{message?:string, success:boolean}> {
        try {
          // First, check if the course is already in the cart
    
            // If courseId is not in cart, add it
            await Course.updateOne(
              { _id: courseId },
              { $addToSet: { purchasedUsers: userId } } // Add courseId to cart array, ensuring uniqueness
            );
            return { message: 'Course added to Purchase List', success:true};
          
        } catch (error) {
          console.error('Error toggling course in cart:', error);
          throw new Error('Failed to update cart');
        }
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
    async getCoursesByIds(courseIds: string[]): Promise<ResponseFetchCourseList> {
        try {
          // Convert courseIds to an array of ObjectId
          const objectIds = courseIds.map(id => new mongoose.Types.ObjectId(id));
      
          // Query the CourseModel to fetch courses with matching IDs
          const courses = await Course.find({
            _id: { $in: objectIds }
          });
      
          if (!courses || courses.length === 0) {
            throw new Error("No courses found with the provided IDs.");
          }
      
          // Format the fetched courses similar to fetchTutorCourses
          const formattedCourses: ResponseFetchCourseList = {
            courses: courses.map((course: any) => ({
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
                benefits: course.benefits_prerequisites?.benefits || [],
                prerequisites: course.benefits_prerequisites?.prerequisites || [],
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
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error; // Re-throw to handle it further up the chain
  }
}

}
