import { CourseService } from "../services/Course.Use.case";
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
        callback(null, response.courses)
    }

    async fetchCourseDetails(call: ServerUnaryCall<any,any>, callback: sendUnaryData<any>): Promise<void>{
        console.log("trig")
        const data = call.request;
        console.log(data, 'data on controller')
        const response = await courseService.fetchCourseDetails(data)
        callback(null,response);
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

        }
    }
}        