import { OrderEventData } from '../../Controllers/Course.controller';
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
} from '../DTOs/IService.dto'
import { IPlainCourse } from '../Models/ICourse';
import { IReview } from '../Models/IReview';

export interface ICourseService {
    handleOrderSuccess(paymentEvent: OrderEventData): Promise<void>
    handleOrderTransactionFail(failedTransactionEvent:OrderEventData):Promise<void>
    uploadVideo(data: UploadVideoDTO): Promise<UploadVideoResponseDTO>;
    uploadCourse(courseData: IPlainCourse): Promise<UploadCourseResponseDTO>
    updateCourse(courseData: IPlainCourse,courseId:string): Promise<UploadCourseResponseDTO>    
    fetchCourse(data:FetchCourseRequestFilter): Promise<FetchCourseResponseDTO >;
    fetchTutorCourses(data: FetchTutorCoursesDTO): Promise<FetchTutorCoursesResponseDTO>;
    fetchCourseDetails(data: FetchCourseDetailsDTO): Promise<FetchCourseDetailsResponseDTO>;
    addToPurchasedList (data:AddToPurchasedListDTO): Promise<AddToPurchasedListResponseDTO>
    getCoursesByIds(data:GetCoursesByIdsDTO):Promise<GetCoursesByIdsResponseDTO>
    uploadImage(data: UploadImageDTO): Promise<UploadImageResponseDTO>
    fetchPurchasedCourses(data:{userId:string}):Promise<{success:boolean, courses?:IPlainCourse[] | undefined, message?:string}>
    deleteCourse(data:{courseId:string}): Promise<any>
    addReview(data:IReview):Promise<{success:boolean, status:number, message:string}>
    fetchReviewByCourseId(data:{courseId:string}):Promise<{ success:boolean, status:number, reviewData:IReview[] | undefined }>
}
        