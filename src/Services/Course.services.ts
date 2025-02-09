import dotenv from "dotenv";
import { ICourseService } from "../Interfaces/IServices/IService.interfaces";
import { StatusCode } from "../Interfaces/Enums/enums";
import {
    UploadVideoDTO,
    UploadVideoResponseDTO,
    UploadImageDTO,
    UploadImageResponseDTO,
    UpdateCourseDTO,
    UploadCourseResponseDTO,
    FetchCourseResponseDTO,
    FetchTutorCoursesDTO,
    FetchTutorCoursesResponseDTO,
    FetchCourseDetailsDTO,
    FetchCourseDetailsResponseDTO,
    AddToPurchasedListDTO,
    AddToPurchasedListResponseDTO,
    GetCoursesByIdsDTO,
    GetCoursesByIdsResponseDTO,
    FetchCourseRequestFilter,
} from '../Interfaces/DTOs/IService.dto'
dotenv.config();
import { kafkaConfig } from "../Configs/Kafka.configs/Kafka.configs";
import ReviewRepository from "../Repositories/Review.repository";
import { IReview } from "../Interfaces/Models/IReview";
import { error } from "console";
import { IPlainCourse } from "../Interfaces/Models/ICourse";
import mongoose from "mongoose";
import { ICourseRepository } from "../Interfaces/IRepositories/ICourseRepository.interface";
import { IReviewRepository } from "../Interfaces/IRepositories/IReviewRepository.interface";
import {IAwsUploader} from "../Interfaces/Configs/IAwsUploader";
import { kafka_Const } from "../Configs/Kafka.configs/Topic.config";

// types/events.ts
export interface OrderEvent {
    orderId: string;
    userId: string;
    courseId: string;
    tutorId: string;
    status: string;
    timestamp: Date;
}
  
// types/events.ts
export interface OrderEventData {
    userId: string;
    tutorId: string;
    courseId: string;
    transactionId: string;
    title: string;
    thumbnail: string;
    price: string;
    adminShare: string; 
    tutorShare: string;
    paymentStatus:boolean;
    timestamp: Date;
    status: string;
}


export class CourseService implements ICourseService {
    private awsUploader: IAwsUploader;
    private courseRepository: ICourseRepository;
    private reviewRepository: IReviewRepository;
    
    constructor(courseRepository: ICourseRepository, reviewRepository: IReviewRepository, awsUploader: IAwsUploader) {
        this.courseRepository = courseRepository;
        this.reviewRepository = reviewRepository;
        this.awsUploader = awsUploader;
    }

    async handleOrderSuccess(paymentEvent: OrderEventData): Promise<void> {
        try {
            const { courseId, userId} = paymentEvent;
            const result = await this.courseRepository.addToPurchaseList(courseId, userId);
            if(!result.success){
                throw new Error("Error occured in updating, success is false.")
            }
            await kafkaConfig.sendMessage('course.response', {
                success: true,
                service: 'course-service',
                status:"COMPLETED",
                transactionId: paymentEvent.transactionId
              });
        } catch (error:any) {
            console.error('Order creation failed:', error);
            await kafkaConfig.sendMessage('course.response', {
                ...paymentEvent,
                service: 'course-service',
                status: 'FAILED',
                error: error.message
              });
        } 
    }
  
    async handleOrderTransactionFail(failedTransactionEvent:OrderEventData):Promise<void>{
        try {
            const {courseId, userId}  = failedTransactionEvent;
            const updated = await this.courseRepository.removeFromPurchaseList( courseId, userId );
            if(!updated?.success){
                throw new Error("Error in rollbacking")
            }
            await kafkaConfig.sendMessage(kafka_Const.topics.COURSE_ROLLBACK_COMPLETED, {
                transactionId: failedTransactionEvent.transactionId,
                service: 'course-service'
              });
        } catch (error) {
            throw new Error('Error in roll back.');
        }
    }

    async uploadVideo(data: UploadVideoDTO): Promise<UploadVideoResponseDTO> {
        try {
            console.log(data, 'dataaa');
            console.log(Buffer.byteLength(data.videoBinary), 'Video size in bytes');
            const result = await this.awsUploader.uploadVideo(data.videoBinary)
            console.log('File uploaded successfully:', result);
            return { message: "File has been uploaded successfully", success: true, s3Url: result.publicUrl }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('File upload failed:', error.message);
                throw new Error(`File upload failed: ${error.message}`);
            } else {
                console.error('An unknown error occurred:', error);
                throw new Error('File upload failed: Unknown error');
            }
        }
    }

    async uploadImage(data: UploadImageDTO): Promise<UploadImageResponseDTO> {
        try {
            const response = await this.awsUploader.uploadImage(data.imageBinary, data.imageName)
            return { message: "Image uploaded successfully.", s3Url: response.publicUrl, success: true };
        } catch (error) {
            if (error instanceof Error) {
                console.error('File upload failed:', error.message);
                return { success: false, message: `File upload failed: ${error.message}` };
            } else {
                console.error('An unknown error occurred:', error);
                return { success: false, message: 'File upload failed: Unknown error' };
            }
        }
    } 

    async uploadCourse(courseData: IPlainCourse): Promise<UploadCourseResponseDTO> {
        try {
            console.log(courseData, 'data form service')
            const uploadData = await this.courseRepository.createCourse(courseData);
            console.log(uploadData, 'uploaded data ');
            return { success: true, message: "Course succesfully uploaded.", courseId:uploadData._id, courseTitle:uploadData.courseTitle, thumbnail:uploadData.thumbnail };
        } catch (error) {
            console.error('An unknown error occurred:', error);
            return { success: false, message: 'Course upload failed:  error' };
        }
    }

    async updateCourse(courseData: IPlainCourse,courseId:string): Promise<UploadCourseResponseDTO> {
        try {
            console.log(courseData, 'data to update form service')
            const uploadData = await this.courseRepository.updateCourse(courseId,courseData);
            console.log(uploadData, 'uploaded data ');
            return { success: true, message: "Course succesfully updated." }
        } catch (error) {
            console.error('An unknown error occurred:', error);
            return { success: false, message: 'Course update failed:  error' };
        }
    }

    async deleteCourse(data:{courseId:string}): Promise<any> {
        try {
            const {courseId} = data;
            const deleteCourse = await this.courseRepository.deleteCourseById(courseId);
            if(!deleteCourse){
                return {success:false, status:StatusCode.Conflict};
            }
            return {success:true, status: StatusCode.Accepted};
        } catch (error) {
            throw new Error(`Error form service deleting course ${error} `);
        }
    }
 
    async fetchCourse(data:FetchCourseRequestFilter): Promise<FetchCourseResponseDTO> {
        try {
            const filters = {
                category: data.category || null,
                priceOrder: data.priceOrder || null,
                ratingOrder: data.ratingOrder || null,
              };
            console.log('trig fetchCourse')
            const fetchCourse: IPlainCourse[] = await this.courseRepository.getCoursesWithBasicFilter(filters);

            return {
                success: true,
                courses: fetchCourse // Return the array of courses directly
            };
        } catch (error) {
            console.error("An unknown error occurred: ", error);
            return {
                success: false,
                error: 'Failed to fetch courses. Please try again later.'
            };
        }
    }

    async fetchTutorCourses(data: FetchTutorCoursesDTO): Promise<FetchTutorCoursesResponseDTO> {
        try {
            const courses = await this.courseRepository.getCoursesWithFilter({tutorId:data.tutorId});
            return {
                success: true,
                courses: courses,  // Ensure the response matches the ResponseFetchCourseList structure
            };
        } catch (error) { 
            console.error('Error fetching tutor courses:', error);
            return { success: false, message: 'Failed to fetch courses' };  // Added error message for clarity
        }
    }
    async fetchCourseDetails(data: FetchCourseDetailsDTO): Promise<FetchCourseDetailsResponseDTO> {
        try {
            const courseDetails = await this.courseRepository.findCourseById(data.id);
            console.log(courseDetails, 'Course details from service');

            if (!courseDetails?._id) {
                return { courseDetails: undefined, message: 'Course not found' };
            }
            const reviewData = await this.reviewRepository.fetchReviewsByCourseId(courseDetails._id);

            return { courseDetails, reviewData }; // Return the found course details
        } catch (error) {
            console.log(error);
            return { courseDetails: undefined, message: 'An error occurred while fetching course details' };
        }
    }

    async addToPurchasedList(data: AddToPurchasedListDTO): Promise<AddToPurchasedListResponseDTO> {
        try {
            console.log(data);
            const response = await this.courseRepository.addToPurchaseList(data.userId, data.courseId);
            console.log(response);

            return {
                message: response.success ? response.message : "An error occurred while adding to the purchased list", // Provide a default message
                success: response.success,
                status: StatusCode.Created
            };
        } catch (error) {
            console.log(error);
            return {
                message: "Error occurred while creating order", // Ensure message is always a string
                success: false,
                status: StatusCode.ExpectationFailed
            }; 
        }
    }

    async addReview(data:IReview):Promise<{success:boolean, status:number, message:string}>{
        try {
            const createdReview = await this.reviewRepository.addReview(data);
            if(!createdReview){
                return {success:false, status:StatusCode.NotFound, message:"Failed to add review."};
            } 
            console.log(data.courseId,'this is created course id ')
            return {success:true, status:StatusCode.Created, message: "Successfuly added your review."};
        } catch (error) {
            throw new Error(`error have been occured in service while creating review ${error}.`)
        }
    }

    async fetchReviewByCourseId(data:{courseId:string}):Promise<{ success:boolean, status:number, reviewData:IReview[] | undefined }>{
        try {
            const courseId = data.courseId;
            const reviews = await this.reviewRepository.fetchReviewsByCourseId(courseId);
            if(!reviews){
                throw error;
            }
            return {success:true, status:StatusCode.Found, reviewData:reviews}
        }catch(error){
            throw new Error(`Error occured in service while fetching review ${error}`)
        }
    }

    async getCoursesByIds(data: GetCoursesByIdsDTO): Promise<GetCoursesByIdsResponseDTO> {
        try {
            console.log(data, 'data from useCase');
            const courses = await this.courseRepository.getCoursesByIds(data.courseIds);
            console.log(courses, 'fetch courses');

            return {
                success: true,
                courses: courses, // Ensure this is correctly typed
            };
        } catch (error) {
            console.error("Error in getCoursesByIds service:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred', // Provide error details
            };
        }
    }

    async fetchPurchasedCourses(data:{userId:string}):Promise<{success:boolean, courses?:IPlainCourse[] | undefined, message?:string}>{
        try {
            console.log(data, 'dta from service');
            const userObjectId = new mongoose.Types.ObjectId(data.userId);
            const courses = await this.courseRepository.getCoursesWithFilter({purchasedUsers: { $in: [userObjectId] }})
            return {success:true, courses};
        } catch (error) {
            console.error("Error in fetch purchased course service:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred', // Provide error details
            };
        }
    }

}
