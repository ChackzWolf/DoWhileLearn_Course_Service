import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';

export interface ICourseController {
    uploadVideo(call: ServerUnaryCall<any,any>, callback: sendUnaryData<any>): Promise<void>;
    uploadImage(call: ServerUnaryCall<any,any>, callback: sendUnaryData<any>): Promise<void>;
    editCourse(call: ServerUnaryCall<any,any>, callback: sendUnaryData<any>): Promise<void>;
    fetchCourse(call: ServerUnaryCall<any,any>, callback: sendUnaryData<any>): Promise<void>;
    fetchTutorCourses(call: ServerUnaryCall<any,any>, callback: sendUnaryData<any>): Promise<void>;
    fetchCourseDetails(call: ServerUnaryCall<any,any>, callback: sendUnaryData<any>): Promise<void>;
}