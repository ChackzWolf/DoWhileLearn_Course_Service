"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.configs = {
    // LISTENER PORT
    PORT: process.env.PORT || 3004,
    // GRPC PORT CONFIG
    COURSE_GRPC_PORT: process.env.COURSE_GRPC_PORT || 5004,
    // DB COFNIGS
    MONGODB_URL_COURSE: process.env.MONGODB_URL_COURSE || '',
    //AWS CONFIGS
    BUCKET_NAME: process.env.BUCKET_NAME || '',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    AWS_REGION: process.env.AWS_REGION || '',
    // LOGGER CONFIGS
    LOG_RETENTION_DAYS: process.env.LOG_RETENTION_DAYS || '7d'
};
