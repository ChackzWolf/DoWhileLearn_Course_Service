import { CourseService } from "../Services/Course.services";
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
} from "../Interfaces/DTOs/IController.dto";
import { ICourseController } from "../Interfaces/IControllers/IController.interface";
import { StatusCode } from "../Interfaces/Enums/enums";

const courseService = new CourseService();

export class courseController implements ICourseController {
    async uploadVideo(
        call: ServerUnaryCall<VideoRequest, VideoResponse | undefined>,
        callback: sendUnaryData<VideoResponse | undefined>
    ): Promise<void> {
        try {
            console.log(call.request.videoBinary, " call from controller");

            const data = call.request;
            const response = await courseService.uploadVideo(data);
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
            const response = await courseService.uploadImage(data);
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
            console.log(data, "data fro mcntorller");
            const response = await courseService.uploadCourse(data);
            console.log(response, "response");
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
        const response = await courseService.updateCourse(data);
        console.log(response, "response from controller");
        callback(null, response);
    }
    async fetchCourse(
        _call: ServerUnaryCall<null, ResponseFetchCourseList>,
        callback: sendUnaryData<ResponseFetchCourseList>
    ): Promise<void> {
        try {
            const response = await courseService.fetchCourse();
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
        console.log("Fetching tutor courses...");

        const data = call.request;
        try {
            const response = await courseService.fetchTutorCourses(data);

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
            const response = await courseService.fetchCourseDetails(data);
            console.log(response, "Response from service");

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

    async addToPurchasedList(
        call: ServerUnaryCall<AddPurchasedUsersRequest, AddPurchasedUsersResponse>,
        callback: sendUnaryData<AddPurchasedUsersResponse>
    ): Promise<void> {
        try {
            const data = call.request;
            const response = await courseService.addToPurchasedList(data);

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

            const response = await courseService.getCoursesByIds(data);

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
}
