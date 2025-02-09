"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Common fields for all questions
const BaseQuestionSchema = new mongoose_1.Schema({
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
    completedUsers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
        },
    ]
}, { discriminatorKey: "type", _id: false });
// MultipleChoiceQuestion schema
const MultipleChoiceQuestionSchema = new mongoose_1.Schema({
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
const TestOutputSchema = new mongoose_1.Schema({
    value: {
        type: String,
        required: true,
    },
    dataType: {
        type: String,
        required: true,
    },
}, { _id: false });
const TestCaseSchema = new mongoose_1.Schema({
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
const CodingQuestionSchema = new mongoose_1.Schema({
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
const QuestionSchema = new mongoose_1.Schema({}, { _id: false });
const BaseQuestionModel = mongoose_1.default.model("BaseQuestion", BaseQuestionSchema);
BaseQuestionModel.discriminator("QUIZ", MultipleChoiceQuestionSchema);
BaseQuestionModel.discriminator("CODING", CodingQuestionSchema);
// Lesson schema
const LessonSchema = new mongoose_1.Schema({
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
const ModuleSchema = new mongoose_1.Schema({
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
const BenefitsPrerequisitesSchema = new mongoose_1.Schema({
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
const CourseSchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    benefits_prerequisites: BenefitsPrerequisitesSchema,
    Modules: [ModuleSchema],
});
// Create and export Course model
exports.Course = mongoose_1.default.model('Course', CourseSchema);
