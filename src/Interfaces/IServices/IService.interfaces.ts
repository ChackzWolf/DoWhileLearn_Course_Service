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

export interface ICourseUseCase {
    uploadVideo(data: UploadVideoDTO): Promise<UploadVideoResponseDTO>;
    uploadImage(data: UploadImageDTO): Promise<UploadImageResponseDTO>;
    uploadCourse(data: UpdateCourseDTO): Promise<UploadCourseResponseDTO>;
    updateCourse(data: UpdateCourseDTO): Promise<UploadCourseResponseDTO>; 
    fetchCourse(): Promise<FetchCourseResponseDTO >;
    fetchTutorCourses(data: FetchTutorCoursesDTO): Promise<FetchTutorCoursesResponseDTO>;
    fetchCourseDetails(data: FetchCourseDetailsDTO): Promise<FetchCourseDetailsResponseDTO>;
    addToPurchasedList (data:AddToPurchasedListDTO): Promise<AddToPurchasedListResponseDTO>
    getCoursesByIds(data:GetCoursesByIdsDTO):Promise<GetCoursesByIdsResponseDTO>

}
        