import { Course } from "../Schemas/Course.schema";
import { ICourseRepository } from "../Interfaces/IRepositories/ICourseRepository.interface"; // Adjust import path as necessary
import mongoose from 'mongoose';
import { ICourse, IPlainCourse } from "../Interfaces/Models/ICourse";
import { UpdateCourseDTO, AddToPurchaseListResponse, ResponseFetchCourseList } from "../Interfaces/DTOs/IRepository.dto";
import { ObjectId } from "mongodb";
import { restructureSubmitCourse } from "../Utils/Restructure.utils";


export default class CourseRepository implements ICourseRepository {
    // Create a course
      // Create a course
      async createCourse(data: IPlainCourse): Promise<IPlainCourse> {
        const structuredCourse = restructureSubmitCourse(data);
    
        const createdCourse = new Course(structuredCourse);
    
        const savedCourse = await createdCourse.save();
    
        const plainCourse = savedCourse.toObject() as unknown as IPlainCourse;
    
        console.log(plainCourse, 'saved course');
        return plainCourse;
      }
    


  async updateCourse(courseId: string, courseData: IPlainCourse): Promise<IPlainCourse | null> {
    // Find the course by ID and update it
    const updatedCourse = await Course.findByIdAndUpdate(courseId, courseData, {
      new: true,        // return the updated document
      runValidators: true, // run validation before saving
    });
  
    // If no course was found, return null
    if (!updatedCourse) {
      return null;
    }
  
    // Convert the updated document to a plain object and cast to IPlainCourse
    const plainCourse = updatedCourse.toObject() as unknown as IPlainCourse;
    
    console.log(plainCourse, 'updated course');
    
    return plainCourse;
  }


  // Fetch courses
  async getCourses(): Promise<IPlainCourse[]> {
    const fetchCourses = await Course.find().exec(); // Use .exec() for type inference
    console.log(fetchCourses, 'fetch course repository');
    
    // Map over the fetched courses and convert each document to IPlainCourse
    const plainCourses: IPlainCourse[] = fetchCourses.map(course => course.toObject()as unknown as IPlainCourse);
  
    return plainCourses;
  }




  async findCourseById(courseId: string): Promise<IPlainCourse | null> {
    try {
      const pipeline = [
        { $match: { _id: new mongoose.Types.ObjectId(courseId) } },
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "courseId",
            as: "reviews",
          },
        },
        {
          $addFields: {
            averageRating: { $avg: "$reviews.rating" },
            ratingCount: { $size: "$reviews" },
          },
        },
        {
          $project: {
            reviews: 0, // Exclude reviews from the result
          },
        },
      ];
  
      const fetchCourses = await Course.aggregate(pipeline).exec();
      const courseDetails = fetchCourses[0]
  
      // if (!courseDetails) {
      //   throw new Error(`Course with ID ${courseId} not found`);
      // }
  
      console.log(courseDetails, 'fetch course details with average rating');
      return courseDetails;
  
    } catch (error:any) {
      console.error(`Error fetching course details: ${error.message}`);
      throw error; // Re-throw the error for the caller to handle
    }
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
  async fetchTutorCourses(tutorId: string): Promise<any> {
    console.log(tutorId, 'tutorId');
      return
  }


  async getCoursesByIds(courseIds: string[]): Promise<any> {
    try {
      // Convert courseIds to an array of ObjectId
      const objectIds = courseIds.map(id => new mongoose.Types.ObjectId(id));
  
      // Build the aggregation pipeline
      const pipeline = [
        {
          $match: { _id: { $in: objectIds } }, // Match courses by IDs
        },
        {
          $lookup: {
            from: "reviews", // Collection name for reviews
            localField: "_id", // Local field in the courses collection
            foreignField: "courseId", // Foreign field in the reviews collection
            as: "reviews", // Output array field
          },
        },
        {
          $addFields: {
            averageRating: { $avg: "$reviews.rating" }, // Calculate average rating
            ratingCount: { $size: "$reviews" }, // Count the number of reviews
          },
        },
        {
          $project: {
            reviews: 0, // Exclude reviews array from the result
          },
        },
      ];
  
      // Execute the aggregation pipeline
      const courses = await Course.aggregate(pipeline).exec();
  
      console.log(courses, "courses from repository"); 
      if (!courses) {
        throw new Error("No courses found with the provided IDs.");
      }
  
      return courses;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw new Error("Failed to fetch courses.");
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



  async getCoursesWithFilter(filters: any): Promise<IPlainCourse[]> {
    console.log('reached getCoursewithFilter', filters)
    
    const { category, priceOrder, ratingOrder } = filters;
    const matchStage: any = {};
    if (category) matchStage.category = category;
    

    const pipeline = [
      { $match: filters },
      {
        $lookup: {
          from: "reviews", 
          localField: "_id", 
          foreignField: "courseId", 
          as: "reviews",
        },
      },
      {
        $addFields: { 
          averageRating: { $avg: "$reviews.rating" },
          ratingCount: { $size: "$reviews" },
        },
      },
      { 
        $project: {
          reviews: 0, 
        },
      },
    ] as any[];
  


    const sortStage: any = {};
    if (priceOrder === "low") sortStage.price = 1;
    if (priceOrder === "high") sortStage.price = -1;
    if (ratingOrder === "low") sortStage.averageRating = 1;
    if (ratingOrder === "high") sortStage.averageRating = -1;

    if (Object.keys(sortStage).length > 0) {
        pipeline.push({ $sort: sortStage });
    }
    const fetchCourses = await Course.aggregate(pipeline).exec();
    console.log(fetchCourses, 'fetch courses with average rating');
  

    return fetchCourses as IPlainCourse[];
  }


  async getCoursesWithBasicFilter(filters: any ): Promise<IPlainCourse[]> {
    console.log('reached getCoursewithFilter', filters);
  
    // Destructure filters
    const { category, priceOrder, ratingOrder } = filters;
  
    // Dynamic match stage
    const matchStage: any = {};
    if (category) matchStage.courseCategory = category;
  console.log(matchStage)
    // Base pipeline
    const pipeline = [
      { $match: matchStage }, // Use dynamically created matchStage here
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "courseId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
          ratingCount: { $size: "$reviews" },
          finalPrice: {
            $ifNull: ["$discountPrice", "$coursePrice"], // If discountPrice exists, use it, else fallback to coursePrice
          },
        },
      },
      {
        $project: {
          reviews: 0, // Exclude reviews from output
        },
      },
    ] as any[];
  
    // Dynamic sort stage
    const sortStage: any = {};
    if (priceOrder === "low") sortStage.finalPrice = 1;
    if (priceOrder === "high") sortStage.finalPrice = -1;
    if (ratingOrder === "low") sortStage.averageRating = -1;
    if (ratingOrder === "high") sortStage.averageRating = 1;
    console.log(sortStage,'sort stage')
    // Add sort stage only if sorting is specified
    if (Object.keys(sortStage).length > 0) {
      pipeline.push({ $sort: sortStage });
    }
  
    // Execute the aggregation pipeline
    const fetchCourses = await Course.aggregate(pipeline).exec();
  
  
    return fetchCourses as IPlainCourse[];
  }
  










  async fetchAllCourse(filterOptions: any) {
    try {
        const { search, category, level, sort } = filterOptions;
        console.log(filterOptions,'filteredOPtions');
        const filters: any = {
            status: true,
        };
        if (search) {
            filters.title = { $regex: search, $options: "i" };
        }
        if (category) {
            filters.category = category;
        }
        if (level) {
            filters.level = level;
        }

        // Determine sorting order
        let sortOption: any = {};
        if (sort === "price-asc") {
            sortOption = { discountPrice: 1 };
        } else if (sort === "price-desc") {
            sortOption = { discountPrice: -1 };
        }

        // Build the aggregation pipeline
        const pipeline = [
            { $match: filters },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "courseId",
                    as: "reviews",
                },
            },
            {
                $addFields: {
                    averageRating: { $avg: "$reviews.rating" },
                },
            },
            {
                $project: {
                    reviews: 0,
                },
            },
        ]as any[];

        // Only add $sort stage if sortOption has keys
        if (Object.keys(sortOption).length > 0) {
            pipeline.push({ $sort: sortOption });
        }

        const allCourse = await Course.aggregate(pipeline);

        console.log("allCourse result in repo:", allCourse);
        return {
            courses: allCourse,
            message: "Fetching courses was successful",
            success: true,
        };
    } catch (error) {
        console.log("error in fetching courses in repo:", error);
        return {
            success: false,
            message: "An error occurred while fetching courses.",
        };
    }

    
  }
}
