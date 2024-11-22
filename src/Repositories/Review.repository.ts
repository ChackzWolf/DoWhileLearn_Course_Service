import Review from "../Schemas/Review.schema";
import { IReview } from "../Interfaces/Models/IReview";
import mongoose from "mongoose";

export default class ReviewRepository  {
    async fetchReviewsByCourseId(courseId: string): Promise<IReview[] | undefined> {
        const courseObjectId = new mongoose.Types.ObjectId(courseId);
        const reviews: IReview[] = await Review.find({ courseId: courseObjectId });
        console.log(reviews, 'from review.repository');
        return reviews;
    }

    async addReview(data: IReview) {
        const dataToAdd = {
            courseId: new mongoose.Types.ObjectId(data.courseId),
            userId: new mongoose.Types.ObjectId(data.userId),
            rating: data.rating,
            helpful: 0,
            comment: data.comment
        };
    
        try {
            // Use findOneAndUpdate to either update an existing review or create a new one
            const updatedReview = await Review.findOneAndUpdate(
                { courseId: dataToAdd.courseId, userId: dataToAdd.userId }, // Filter by courseId and userId
                { $set: dataToAdd }, // Update the review with the new data
                { new: true, upsert: true } // Return the updated document, and insert if not found
            );
    
            console.log(updatedReview, 'review saved or updated from review.repository.');
            return updatedReview;
        } catch (error) {
            console.error('Error saving or updating review:', error);
            throw new Error('Could not save or update review.');
        }
    }



















    

    // async getOverallRating(courseId: string): Promise<number | null> {
    //     const courseObjectId = new mongoose.Types.ObjectId(courseId);
    //     const result = await Review.aggregate([
    //         { $match: { courseId:courseObjectId } }, // Filter reviews by courseId
    //         {
    //             $group: {
    //                 courseId: "$courseId",
    //                 averageRating: { $avg: "$rating" }, // Calculate average rating
    //             }
    //         }
    //     ]);

    //     if (result.length > 0) {
    //         const { averageRating } = result[0];
    //         return parseFloat(averageRating.toFixed(2)); // Limit decimal points to 2
    //     }
    //     return null; // Return null if no reviews are found
    // }
}  