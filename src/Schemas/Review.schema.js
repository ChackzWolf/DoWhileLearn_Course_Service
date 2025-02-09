"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Create the review schema
const reviewSchema = new mongoose_1.Schema({
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    helpful: {
        type: Number,
        ref: 'Helpful',
        required: true,
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
const Review = (0, mongoose_1.model)('Review', reviewSchema);
exports.default = Review;
