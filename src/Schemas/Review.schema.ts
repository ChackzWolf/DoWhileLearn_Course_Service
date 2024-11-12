import { Schema, model, } from 'mongoose';
import { IReview } from '../Interfaces/Models/IReview';



// Create the review schema
const reviewSchema = new Schema<IReview>({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true, 
    min: 1,
    max: 5, 
  },
  helpful:{
    type:Number,
    ref: 'Helpful',
    required:true,
  },
  comment: {
    type: String,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to update the `updatedAt` timestamp on every save
reviewSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Create and export the Review model
const Review = model<IReview>('Review', reviewSchema);

export default Review;
