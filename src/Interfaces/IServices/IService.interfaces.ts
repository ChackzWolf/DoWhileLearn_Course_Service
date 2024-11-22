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
} from '../DTOs/IService.dto'
import { IPlainCourse } from '../Models/ICourse';

export interface ICourseUseCase {
    uploadVideo(data: UploadVideoDTO): Promise<UploadVideoResponseDTO>;
    uploadCourse(courseData: IPlainCourse): Promise<UploadCourseResponseDTO>
    updateCourse(courseData: IPlainCourse,courseId:string): Promise<UploadCourseResponseDTO>    
    fetchCourse(): Promise<FetchCourseResponseDTO >;
    fetchTutorCourses(data: FetchTutorCoursesDTO): Promise<FetchTutorCoursesResponseDTO>;
    fetchCourseDetails(data: FetchCourseDetailsDTO): Promise<FetchCourseDetailsResponseDTO>;
    addToPurchasedList (data:AddToPurchasedListDTO): Promise<AddToPurchasedListResponseDTO>
    getCoursesByIds(data:GetCoursesByIdsDTO):Promise<GetCoursesByIdsResponseDTO>

}
        