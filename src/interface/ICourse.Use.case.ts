import { CourseDetails, ResponseFetchCourseList } from "../interface/ICourse.repository";

export interface ICourseUseCase {
    uploadVideo(data: { videoBinary: Buffer }): Promise<{ success: boolean; message: string; s3Url?: string }>;
    uploadImage(data: { imageBinary: Buffer; imageName: string }): Promise<{ success: boolean; message: string; s3Url?: string }>;
    uploadCourse(data: any): Promise<{ success: boolean; message: string }>;
    fetchCourse(): Promise<ResponseFetchCourseList | { success: boolean; message: string }>;
    fetchTutorCourses(data: { tutorId: string }): Promise<{ success: boolean; courses?: ResponseFetchCourseList }>;
    fetchCourseDetails(data: { id: string }): Promise<any>; // Adjust the return type as necessary
}
