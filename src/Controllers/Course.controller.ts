import {
    ServerUnaryCall,
    sendUnaryData,
    ServiceError,
    status,
} from "@grpc/grpc-js";
import {
    ImageRequest,
    ImageResponse,
    RequestFetchCourseDetails,
    RequestFetchTutorCourse,
    ResponseFetchCourse,
    ResponseFetchCourseList,
    SubmitCourseRequest,
    SubmitCourseResponse,
    VideoRequest,
    VideoResponse,
    AddPurchasedUsersRequest,
    AddPurchasedUsersResponse,
    RequestGetCoursesByIds,
    FetchCourseRequestFilter,
} from "../Interfaces/DTOs/IController.dto";
import { ICourseController } from "../Interfaces/IControllers/IController.interface";
import { StatusCode } from "../Interfaces/Enums/enums";
import { kafkaConfig } from "../Configs/Kafka.configs/Kafka.configs";
import { KafkaMessage } from 'kafkajs';
import { IReview } from "../Interfaces/Models/IReview";
import { restructureSubmitCourse } from "../Utils/Restructure.utils";
import { ICourseService } from "../Interfaces/IServices/IService.interfaces";
import { kafka_Const } from "../Configs/Kafka.configs/Topic.config";


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
    paymentStatus: boolean;
    timestamp: Date;
    status: string;
}




export class CourseController implements ICourseController {

    private courseService : ICourseService

    constructor(courseService: ICourseService){
        this.courseService = courseService
    }

    async start(): Promise<void> {
        const topics = [
            kafka_Const.topics.COURSE_UPDATE,
            kafka_Const.topics.COURSE_ROLLBACK,
        ]

        await kafkaConfig.consumeMessages(
            kafka_Const.COURSE_SERVICE_GROUP_NAME,
            topics,
            this.routeMessage.bind(this)
        );
    } 

    async routeMessage(topics: string[], message: KafkaMessage, topic: string): Promise<void> {
        try {
            switch (topic) {
                case kafka_Const.topics.COURSE_UPDATE:
                    await this.handleMessage(message);
                    break;
                case kafka_Const.topics.COURSE_ROLLBACK:
                    await this.handleRollback(message);
                    break;
                default:
                    console.warn(`Unhandled topic: ${topic}`);
            }
        } catch (error) {

        }
    }
 
    // checking order  success or fail
    private async handleMessage(message: KafkaMessage): Promise<void> {
        try {
            const paymentEvent: OrderEventData = JSON.parse(message.value?.toString() || '');
            console.log('START', paymentEvent, 'MESAGe haaha')  
            await this.courseService.handleOrderSuccess(paymentEvent);
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }
    private async handleRollback(message: KafkaMessage): Promise<void> {
        try {
            const paymentEvent: OrderEventData = JSON.parse(message.value?.toString() || '');
            console.log(' Role back started ', paymentEvent, 'MESAGe haaha')
            await this.courseService.handleOrderTransactionFail(paymentEvent)
        } catch (error) {
            console.error('Error processing message:', error);
        }
    } 



    async uploadVideo(
        call: ServerUnaryCall<VideoRequest, VideoResponse | undefined>,
        callback: sendUnaryData<VideoResponse | undefined>
    ): Promise<void> {
        try {
            console.log(call.request.videoBinary, " call from controller");

            const data = call.request;
            const response = await this.courseService.uploadVideo(data);
            console.log("giving response", response);
            callback(null, response);
        } catch (err) {
            callback(err as ServiceError);
        }
    }
    async uploadImage(
        call: ServerUnaryCall<ImageRequest, ImageResponse>,
        callback: sendUnaryData<ImageResponse>
    ): Promise<void> {
        try {
            const data = call.request;
            const response = await this.courseService.uploadImage(data);
            callback(null, response);
        } catch (error) {
            callback(error as ServiceError); 
        } 
    }

    async uploadCourse(
        call: ServerUnaryCall<SubmitCourseRequest, SubmitCourseResponse>,
        callback: sendUnaryData<SubmitCourseResponse>
    ): Promise<void> {
        try {
            const data = call.request;
            const courseData = restructureSubmitCourse(data);
            console.log(data, "data fro mcntorller");

            console.log(JSON.stringify(data, null, 2));
            const response = await this.courseService.uploadCourse(courseData);
            console.log(response, "response upload course");
            callback(null, response);
        } catch (error) {
            callback(error as ServiceError);
        }
    }

    async editCourse(
        call: ServerUnaryCall<SubmitCourseRequest, SubmitCourseResponse>,
        callback: sendUnaryData<SubmitCourseResponse>
    ): Promise<void> {
        const data = call.request;
        console.log(data, "data from controller");
        console.log(JSON.stringify(data, null, 2));
        const courseId = data.courseId;
        const courseData = restructureSubmitCourse(data);
        const response = await this.courseService.updateCourse(courseData,courseId);
        console.log(response, "response from controller");
        callback(null, response);
    }


    async fetchCourse( 
        call: ServerUnaryCall<FetchCourseRequestFilter, ResponseFetchCourseList>,
        callback: sendUnaryData<ResponseFetchCourseList>
    ): Promise<void> {
        try {
            const data = call.request;
            console.log(data, 'from controller')
            const response = await this.courseService.fetchCourse(data);
            if (response.success && response.courses) {
                callback(null, {
                    courses: response.courses,
                });
            } else {
                callback(
                    {
                        code: status.UNKNOWN,
                        message: response.error || "Failed to fetch courses",
                    },
                    null
                );
            }
        } catch (error) {
            console.error("Error in fetchCourse controller:", error);

            callback(
                {
                    code: status.INTERNAL,
                    message: "Internal server error while fetching courses",
                },
                null
            );
        }
    }


    async fetchTutorCourses(
        call: ServerUnaryCall<RequestFetchTutorCourse, ResponseFetchCourseList>,
        callback: sendUnaryData<ResponseFetchCourseList>
    ): Promise<void> {
        console.log("Fetching tutor courses...", call.request);

        const data = call.request;
        try {
            const response = await this.courseService.fetchTutorCourses(data);

            if (!response.success) { 
                callback(
                    {
                        code: status.NOT_FOUND,
                        details: response.message || "Courses not found",
                    },
                    null
                );
                return;
            }

            callback(null, { courses: response.courses || [] });
        } catch (error) {
            console.error("Error fetching tutor courses:", error);
            callback(
                {
                    code: status.INTERNAL,
                    details: "Failed to fetch tutor courses due to an internal error",
                },
                null
            );
        } 
    }

    async fetchPurchasedCourses(
        call: ServerUnaryCall<any, ResponseFetchCourseList>,
        callback: sendUnaryData<ResponseFetchCourseList>
    ): Promise<void> {
        console.log("Fetching tutor courses with...", call.request);

        const data = call.request;
        try {
            const response = await this.courseService.fetchPurchasedCourses(data);
            console.log(response, 'purchased courses from controller')
            if (!response.success) { 
                callback(
                    {
                        code: status.NOT_FOUND,
                        details: response.message || "Courses not found",
                    },
                    null
                );
                return;
            }

            callback(null, { courses: response.courses || [] });
        } catch (error) {
            console.error("Error fetching tutor courses:", error);
            callback(
                {
                    code: status.INTERNAL,
                    details: "Failed to fetch tutor courses due to an internal error",
                },
                null
            );
        }
    }


    async fetchCourseDetails(
        call: ServerUnaryCall<RequestFetchCourseDetails, ResponseFetchCourse>,
        callback: sendUnaryData<ResponseFetchCourse>
    ): Promise<void> {
        console.log("Triggered fetchCourseDetails");

        const data = call.request;
        console.log(data, "Data received in controller");

        try {
            const response = await this.courseService.fetchCourseDetails(data);
            console.log(response, "Response from service");
            console.log(JSON.stringify(response.courseDetails, null, 2))
            if (response.courseDetails) {
                callback(null, response.courseDetails as ResponseFetchCourse);
            } else {
                throw Error;
            }
        } catch (error) {
            console.error("Error fetching course details:", error);
            callback({
                code: status.INTERNAL,
                details: "An internal error occurred while fetching course details.",
            });
        }
    }


    
    async deleteCourse(
        call: ServerUnaryCall<any, any>,
        callback: sendUnaryData<any>
    ):Promise<void>{
        try {
            const data = call.request;
            const response = await this.courseService.deleteCourse(data);
            callback(null, response);
        } catch (error) {
            console.error("Error delete course :", error);
            callback({
                code: status.INTERNAL,
                details: "An internal error occurred while fetching course details.",
            });
        }
    }





    async addToPurchasedList(
        call: ServerUnaryCall<AddPurchasedUsersRequest, AddPurchasedUsersResponse>,
        callback: sendUnaryData<AddPurchasedUsersResponse>
    ): Promise<void> {
        try {
            const data = call.request;
            const response = await this.courseService.addToPurchasedList(data);

            // Ensure the response is properly formatted as AddPurchasedUsersResponse
            callback(null, {
                success: response.success,
                message: response.message || "",
                status: response.status === StatusCode.Created,
            });
        } catch (err) {
            console.error("Error occurred while adding to purchased list:", err);
            callback({
                code: status.INTERNAL,
                details: "An error occurred while processing your request.",
            });
        }
    }

    async getCoursesByIds(
        call: ServerUnaryCall<RequestGetCoursesByIds, ResponseFetchCourseList>,
        callback: sendUnaryData<ResponseFetchCourseList>
    ): Promise<void> {
        try {
            console.log("Triggering getCoursesByIds controller");
            const data = call.request;

            const response = await this.courseService.getCoursesByIds(data);

            console.log(response, "Response from service");

            if (response.success) {
                callback(null, { courses: response.courses });
            } else {
                callback({
                    code: status.NOT_FOUND,
                    message: response.message || "Courses not found",
                });
            }
        } catch (error) {
            console.error("Error in getCoursesByIds controller:", error);
            callback({
                code: status.INTERNAL,
                message: "Internal server error",
            });
        }
    }

    async addReview(call:ServerUnaryCall<IReview,any>,callback: sendUnaryData<any>){
        try {
            console.log('Triggerd add review', call.request);
            const data = call.request;
            const response = await this.courseService.addReview(data)
            callback(null, response); 
        } catch (error) {
            console.error("Error in  controller adding review:", error);
            callback({
                code: status.INTERNAL,
                message: "Internal server error",
            });
        }
    } 

    async fetchReviewsOfCourse(call:ServerUnaryCall<any,any>, callback: sendUnaryData<any>){
        try {
            console.log(call.request,'nagaram nagaram');
            const data = call.request;
            const response = await this.courseService.fetchReviewByCourseId(data);
            console.log(response, 'reseponse of fetch review');
            callback(null,response);
        } catch (error) {
            callback(error as ServiceError);
        }
    }


    
    test(_call: ServerUnaryCall<null, {success:boolean}>, callback: sendUnaryData<{success:boolean}>): void {
        console.log('test')
        callback(null, {success:true})
    }
}
