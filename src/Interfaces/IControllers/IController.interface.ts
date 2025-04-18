import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import { GetCourseInCartRequest,
        AddPurchasedUsersRequest,
    AddPurchasedUsersResponse,
RequestFetchCourseDetails,
RequestFetchTutorCourse,
ResponseFetchCourse,
ResponseFetchCourseList,
EmptyRequest,
VideoRequest,
VideoResponse,
ImageRequest,
ImageResponse,
SubmitCourseRequest,
SubmitCourseResponse,
RequestGetCoursesByIds,
FetchCourseRequestFilter
} from '../DTOs/IController.dto';
import { KafkaMessage } from 'kafkajs';

export interface ICourseController {
    routeMessage(topics: string[], message: KafkaMessage, topic: string): Promise<void>

    
    uploadVideo(call: ServerUnaryCall<VideoRequest, VideoResponse>, callback: sendUnaryData<VideoResponse>): Promise<void>;
    uploadImage(call: ServerUnaryCall<ImageRequest, ImageResponse>, callback: sendUnaryData<ImageResponse>): Promise<void>;
    uploadCourse(call: ServerUnaryCall<SubmitCourseRequest, SubmitCourseResponse>, callback: sendUnaryData<SubmitCourseResponse>): Promise<void>;
    editCourse(call: ServerUnaryCall<SubmitCourseRequest, SubmitCourseResponse>, callback: sendUnaryData<SubmitCourseResponse>): Promise<void>;
    fetchCourse(call: ServerUnaryCall<FetchCourseRequestFilter, ResponseFetchCourseList>, callback: sendUnaryData<ResponseFetchCourseList>): Promise<void>; // Changed response type here
    fetchTutorCourses(call: ServerUnaryCall<RequestFetchTutorCourse, ResponseFetchCourseList>, callback: sendUnaryData<ResponseFetchCourseList>): Promise<void>;
    fetchCourseDetails(call: ServerUnaryCall<RequestFetchCourseDetails, ResponseFetchCourse>, callback: sendUnaryData<ResponseFetchCourse>): Promise<void>;
    getCoursesByIds(call: ServerUnaryCall<GetCourseInCartRequest, ResponseFetchCourseList>, callback: sendUnaryData<ResponseFetchCourseList>):Promise<void>
    addToPurchasedList(call:ServerUnaryCall<AddPurchasedUsersRequest, AddPurchasedUsersResponse>, callback:sendUnaryData<AddPurchasedUsersResponse>):Promise<void>
    getCoursesByIds(call: ServerUnaryCall<RequestGetCoursesByIds, ResponseFetchCourseList>, callback: sendUnaryData<ResponseFetchCourseList>): Promise<void> }