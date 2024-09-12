const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema for Lesson
const LessonSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  video: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

// Create schema for Module
const ModuleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  lessons: [LessonSchema]  // Array of lessons
});

// Create schema for Benefits and Prerequisites
const BenefitsPrerequisitesSchema = new Schema({
  benefits: {
    type: [String],  // Array of strings
    required: true
  },
  prerequisites: {
    type: [String],  // Array of strings
    required: true
  }
});

// Create schema for Course
const CourseSchema = new Schema({
  courseCategory: {
    type: String,
    required: true
  },
  courseDescription: {
    type: String,
    required: true
  },
  courseLevel: {
    type: String,
    required: true
  },
  coursePrice: {
    type: String,
    required: true
  },
  courseTitle: {
    type: String,
    required: true
  },
  demoURL: {
    type: String,
    required: true
  },
  discountPrice: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  benefits_prerequisites: BenefitsPrerequisitesSchema,
  Modules: [ModuleSchema]  // Array of modules
});

// Create model from schema
export const Course = mongoose.model('Course', CourseSchema);

