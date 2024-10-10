import { ICourse } from "../Models/ICourse.";
import {
        UpdateCourseDTO,
        AddToPurchaseListResponse,
        ResponseFetchCourseList
        } from "../DTOs/IRepository.dto"
  


export interface ICourseRepository {
    createCourse(data: UpdateCourseDTO): Promise<ICourse>;
    updateCourse(data: UpdateCourseDTO): Promise<any>;
    getCourses(): Promise<ResponseFetchCourseList>;
    fetchTutorCourses(tutorId: string): Promise<ResponseFetchCourseList>;
    findCourseById(courseId: string): Promise<any>; // Adjust the return type as necessary
    addToPurchaseList(userId: string, courseId: string):Promise<AddToPurchaseListResponse>
    fetchTutorCourses(tutorId: string): Promise<ResponseFetchCourseList>
    getCoursesByIds(courseIds: string[]): Promise<ResponseFetchCourseList>
}
