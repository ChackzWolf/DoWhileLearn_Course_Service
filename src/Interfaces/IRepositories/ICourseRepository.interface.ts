import { ICourse, IPlainCourse } from "../Models/ICourse";
import {
        UpdateCourseDTO,
        AddToPurchaseListResponse,
        ResponseFetchCourseList
        } from "../DTOs/IRepository.dto"
  


export interface ICourseRepository {
    createCourse(data: IPlainCourse): Promise<IPlainCourse>;
    addToPurchaseList( courseId: string, userId: string): Promise<AddToPurchaseListResponse>
    removeFromPurchaseList( courseId: string, userId: string ): Promise<AddToPurchaseListResponse>
    updateCourse(courseId: string, courseData: IPlainCourse): Promise<IPlainCourse | null>
    deleteCourseById(courseId: string): Promise<boolean>
    getCoursesWithBasicFilter(filters: any): Promise<IPlainCourse[]>
    getCoursesWithFilter(filters:any): Promise<IPlainCourse[]>
    findCourseById(courseId: string): Promise<IPlainCourse | null>
    getCoursesByIds(courseIds: string[]): Promise<any>
}
