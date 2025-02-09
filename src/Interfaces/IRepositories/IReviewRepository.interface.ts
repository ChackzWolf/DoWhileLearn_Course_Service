import { IReview } from "../Models/IReview";

export interface IReviewRepository {
    fetchReviewsByCourseId(courseId: string): Promise<IReview[] | undefined>
    addReview(data: IReview):Promise<any>
}