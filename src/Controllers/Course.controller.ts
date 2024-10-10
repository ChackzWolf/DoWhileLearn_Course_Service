import { CourseService } from "../Services/Course.services";
import * as grpc from '@grpc/grpc-js';
import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import { ICourseController } from "../Interfaces/IControllers/IController.interface";
import { ImageRequest, ImageResponse, SubmitCourseRequest, SubmitCourseResponse, VideoRequest, VideoResponse } from "../Interfaces/DTOs/IController.dto";

const courseService = new CourseService()


export class courseController implements ICourseController {
    async uploadVideo(call: grpc.ServerUnaryCall<VideoRequest, VideoResponse | undefined>, callback: grpc.sendUnaryData<VideoResponse | undefined >): Promise<void> {
        try {
            console.log(call.request.videoBinary,' call from controller');

            const data = call.request;
            const response = await courseService.uploadVideo(data)
            console.log('giving response', response)
            callback(null,response); 
        } catch (err) {
            callback(err as grpc.ServiceError)
        } 
    }
    async uploadImage(call: grpc.ServerUnaryCall<ImageRequest, ImageResponse>, callback: grpc.sendUnaryData<ImageResponse>): Promise<void> {
        try{
            const data = call.request; 
            const response = await courseService.uploadImage(data);
            callback(null,response);
        }catch(error){
            callback(error as grpc.ServiceError)
        }    
    }

    async uploadCourse(call: grpc.ServerUnaryCall<SubmitCourseRequest, SubmitCourseResponse>, callback: grpc.sendUnaryData<SubmitCourseResponse>): Promise<void> {
        try {
            const data = call.request;
            console.log(data, 'data fro mcntorller')
            const response = await courseService.uploadCourse(data);
            console.log(response, 'response')
            callback(null, response)
        }catch(error){
            callback(error as grpc.ServiceError)
        }

    }

    async editCourse (call: ServerUnaryCall <any,any>, callback: sendUnaryData<any>): Promise<void>{
        const data = call.request;
        console.log(data, 'data from controller')
        const response = await courseService.updateCourse(data);
        console.log(response, 'response from controller')
        callback(null, response);
    }
    async fetchCourse(call: ServerUnaryCall<any,any>, callback: sendUnaryData<any>): Promise<void>{
        const response = await courseService.fetchCourse();
        console.log(response, 'resonsesss')
        callback(null, response); 
    }

    async fetchTutorCourses(call: ServerUnaryCall<any,any>, callback: sendUnaryData<any>): Promise<void>{
        console.log("trig")
        const data = call.request;
        const response = await courseService.fetchTutorCourses(data)
        callback(null, {courses:response.courses})
    }

    async fetchCourseDetails(call: ServerUnaryCall<any,any>, callback: sendUnaryData<any>): Promise<void>{
        console.log("trig")
        const data = call.request;
        console.log(data, 'data on controller')
        const response = await courseService.fetchCourseDetails(data)
        console.log(response, response)
        callback(null,response.courseDetails);
    }

    async addToPurchasedList(call:grpc.ServerUnaryCall<any, any>, callback:grpc.sendUnaryData<any>):Promise<void>{
        try {
            const data= call.request
            const response = await courseService.addToPurchasedList(data)
            console.log(response,'response from controller');
            callback(null,response)
        } catch (err) {
            callback(err as grpc.ServiceError);
        }
    }

    async getCoursesByIds(call:grpc.ServerUnaryCall<any, any>, callback:grpc.sendUnaryData<any>):Promise<void>{
        try{
            console.log('trig')
            const data= call.request
            const response = await courseService.getCoursesByIds(data)
            console.log(response?.courses, 'resonsesss')
            if(response){
                callback(null, response.courses);
            }
        }catch(error){
            callback(error as grpc.ServiceError);
        }
    }
}        