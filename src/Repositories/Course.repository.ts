import { Course } from "../Schemas/Course.schema";
import { ICourseRepository } from "../Interfaces/IRepositories/IRepository.interface"; // Adjust import path as necessary
import mongoose from 'mongoose';
import { ICourse } from "../Interfaces/Models/ICourse";
import { UpdateCourseDTO, AddToPurchaseListResponse, ResponseFetchCourseList } from "../Interfaces/DTOs/IRepository.dto";
import { ObjectId } from "mongodb";


export default class CourseRepository implements ICourseRepository {
  // Create a course
  async createCourse(data: UpdateCourseDTO): Promise<ICourse> {
    const createdCourse = new Course(data);
    const savedCourse = await createdCourse.save();
    console.log(savedCourse, 'saved course');
    return savedCourse;
  }

  // Create a course
  async updateCourse(data: UpdateCourseDTO): Promise<ICourse> {
    const updatedCourse = await Course.findByIdAndUpdate(data.courseId, data, { new: true, runValidators: true });
    console.log(updatedCourse, 'updated course');
    return updatedCourse;
  }



  // Fetch courses
  async getCourses(): Promise<ResponseFetchCourseList> {
    const fetchCourse = await Course.find().exec(); // Use .exec() for type inference

    const formattedCourses: ResponseFetchCourseList = {
      courses: fetchCourse.map((course: ICourse) => ({
        _id: String(course._id),
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


  async findCourseById(courseId: string): Promise<ICourse | null> {
    const courseDetails = await Course.findById(courseId);
    console.log(courseDetails, 'course details from repo');
    return courseDetails; // This can return null if no course is found
  }

  async addToPurchaseList( courseId: string, userId: string): Promise<AddToPurchaseListResponse> {
    try {
      // First, check if the course is already in the cart
      // If courseId is not in cart, add it
      console.log(userId, courseId, 'data from ')
      const courseObjectId = new ObjectId(courseId);
      const userObjectId = new ObjectId(userId);
      const updatedCourse = await Course.updateOne(
        { _id: courseObjectId },
        { $addToSet: { purchasedUsers: userObjectId } } // Add userId to purchasedUsers array, ensuring uniqueness
      );
      console.log(updatedCourse, 'updated course')
      if(!updatedCourse){
        console.log('error in adding to purchase list')
        throw Error
      }
      return { message: 'Course added to Purchase List', success: true };
    } catch (error) {
      console.error('Error adding course to purchase list:', error);
      throw new Error('Failed to update purchase list');
    }
  }
  async removeFromPurchaseList( courseId: string, userId: string ): Promise<AddToPurchaseListResponse> {
    try { 
        // Remove userId from purchasedUsers array

        const courseObjectId = new ObjectId(courseId);
        const userObjectId = new ObjectId(userId); 
        
        const updatedCourse = await Course.updateOne(
            { _id: courseObjectId },
            { $pull: { purchasedUsers: userObjectId } } // Remove userId from purchasedUsers array
        );

        if (updatedCourse.modifiedCount === 0) {
            console.log('UserId not found or error in removing from purchase list');
            return { message: 'User not found in purchase list or already removed.', success: false };
        }

        return { message: 'User removed from purchase list', success: true };
    } catch (error) {
        console.error('Error removing user from purchase list:', error);
        throw new Error('Failed to update purchase list');
    }
}
  async fetchTutorCourses(tutorId: string): Promise<ResponseFetchCourseList> {
    console.log(tutorId, 'tutorId');
    const fetchCourse = await Course.find({ tutorId });
    const formattedCourses: ResponseFetchCourseList = {
      courses: fetchCourse.map((course: ICourse) => ({
        _id: String(course._id),
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
      const courses = await Course.find({ _id: { $in: objectIds } });

      if (!courses || courses.length === 0) {
        throw new Error("No courses found with the provided IDs.");
      }

      // Format the fetched courses similar to fetchTutorCourses
      const formattedCourses: ResponseFetchCourseList = {
        courses: courses.map((course: ICourse) => ({
          _id: String(course._id), // Ensure _id is a string
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
      throw new Error("Failed to fetch courses: "); // Provide more context in the error
    }
  }

  async deleteCourseById(courseId: string): Promise<boolean> {
    try {
        const result = await Course.findByIdAndDelete(courseId).exec();
        return result ? true : false;
    } catch (error) {
        console.error(`Error deleting course with ID ${courseId}:`, error);
        throw new Error(`Error deleting course: ${error}`);
    }
  }
}
