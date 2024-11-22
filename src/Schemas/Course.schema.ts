import mongoose, { Schema, Document } from 'mongoose';

// Common fields for all questions
const BaseQuestionSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["QUIZ", "CODING"],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  completedUsers:[
    {
      type:Schema.Types.ObjectId,
    },
  ]
}, { discriminatorKey: "type", _id: false });

// MultipleChoiceQuestion schema
const MultipleChoiceQuestionSchema = new Schema({
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: Number,
    required: true,
  },
}, { _id: false });

// CodingQuestion schema
const TestOutputSchema = new Schema({
  value: {
    type: String,
    required: true,
  },
  dataType: {
    type: String,
    required: true,
  },
}, { _id: false });

const TestCaseSchema = new Schema({
  parameters: [
    {
      value: {
        type: String,
        required: true,
      },
      dataType: {
        type: String,
        required: true,
      },
    },
  ],
  expectedValue: TestOutputSchema,
}, { _id: false });

const CodingQuestionSchema = new Schema({
  startingCode: {
    type: String,
    required: true,
  },
  noOfParameters: {
    type: Number,
    required: true,
  },
  solution: {
    type: String,
    required: true,
  },
  parameters: [
    {
      value: {
        type: String,
        required: true,
      },
      dataType: {
        type: String,
        required: true,
      },
    },
  ],
  hints: [
    {
      type: String,
    },
  ],
  expectedOutput: TestOutputSchema,
  testCases: [TestCaseSchema],
}, { _id: false });

// Main Question schema with discriminators
const QuestionSchema = new Schema({}, { _id: false });
const BaseQuestionModel = mongoose.model("BaseQuestion", BaseQuestionSchema);

BaseQuestionModel.discriminator("QUIZ", MultipleChoiceQuestionSchema);
BaseQuestionModel.discriminator("CODING", CodingQuestionSchema);

// Lesson schema
const LessonSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  questions: [BaseQuestionSchema], // Array of discriminated question types
});

// Module schema
const ModuleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  lessons: [LessonSchema],
});

// Benefits and Prerequisites schema
const BenefitsPrerequisitesSchema = new Schema({
  benefits: {
    type: [String],
    required: true,
  },
  prerequisites: {
    type: [String],
    required: true,
  },
});

// Course schema
const CourseSchema = new Schema({
  tutorId: {
    type: String,
    required: true,
  },
  courseCategory: {
    type: String,
    required: true,
  },
  courseDescription: {
    type: String,
    required: true,
  },
  courseLevel: {
    type: String,
    required: true,
  },
  coursePrice: {
    type: String,
    required: true,
  },
  courseTitle: {
    type: String,
    required: true,
  },
  demoURL: {
    type: String,
    required: true,
  },
  discountPrice: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  purchasedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  benefits_prerequisites: BenefitsPrerequisitesSchema,
  Modules: [ModuleSchema],
});
// Create and export Course model
export const Course = mongoose.model<Document>('Course', CourseSchema);

