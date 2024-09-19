import { CourseService } from "../services/CourseService";
import * as grpc from '@grpc/grpc-js';
import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';

const courseService = new CourseService()


export class courseController {

    async uploadVideo(call: ServerUnaryCall<any,any>, callback: sendUnaryData<any>): Promise<void>{
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

    async uploadImage(call: ServerUnaryCall<any,any>, callback: sendUnaryData<any>): Promise<void>{
        const data = call.request; 
        const response = await courseService.uploadImage(data);
        callback(null,response);
    }

    async uploadCourse (call: ServerUnaryCall<any,any>, callback: sendUnaryData<any>): Promise<void>{
        const data = call.request;
        console.log(data, 'data fro mcntorller')
         
        const response = await courseService.uploadCourse(data);
        console.log(response, 'response')
        callback(null, response)
    }

    async fetchCourse(call: ServerUnaryCall<any,any>, callback: sendUnaryData<any>): Promise<void>{
        const response = await courseService.fetchCourse();
        console.log(response, "from contoller")
        callback(null, response);
    }

    async fetchTutorCourses(call: ServerUnaryCall<any,any>, callback: sendUnaryData<any>): Promise<void>{
        console.log("trig")
        const data = call.request;
        console.log(data, 'from controller')
        const response = await courseService.fetchTutorCourses(data)
        console.log(response, "rsponse");
        callback(null, response.courses)
    }

    async fetchCourseDetails(call: ServerUnaryCall<any,any>, callback: sendUnaryData<any>): Promise<void>{
        console.log("trig")
        const data = call.request;
        console.log(data, 'data on controller')
        const response = await courseService.fetchCourseDetails(data)
        callback(null,response);
    }
}      