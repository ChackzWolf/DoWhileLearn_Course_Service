// courseService.js
const express = require('express');
import dotenv from "dotenv";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { CourseController } from "./Controllers/Course.controller";
import { connectDB } from "./Configs/DB.configs/mongoDB";
import morgan from 'morgan';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs'
import { configs } from "./Configs/ENV_configs/ENV.configs";
import { CourseService } from "./Services/Course.services";
import ReviewRepository from "./Repositories/Review.repository";
import CourseRepository from "./Repositories/Course.repository";
import { AwsUploader } from "./Configs/S3/s3";

const app = express();


// error log
const logger = winston.createLogger({
    level: 'info', 
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console(), // Log to the console
      new DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: configs.LOG_RETENTION_DAYS // Keep logs for 14 days
      })
    ],
  }); 
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
// error log end



const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));



dotenv.config()


const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, "protos/course.proto"),
    {keepCase:true , longs: String, enums: String , defaults: true, oneofs: true}
)

const courseProto = grpc.loadPackageDefinition(packageDefinition) as any;

const server = new grpc.Server({

  
})

 

const grpcServer = () => {
    server.bindAsync(
        `0.0.0.0:${configs.COURSE_GRPC_PORT}`,
        grpc.ServerCredentials.createInsecure(),
        (err,port)=>{
            if(err){
                console.log(err, "Error happened grpc course service.");
                return;
            }else{

                console.log("COURSE_SERVICE running on port", port);   
            }
        },

    )
}
grpcServer() 
connectDB()


const router = express.Router();
module.exports = router;  


const awsUploader = new AwsUploader();
const reviewRepository = new ReviewRepository(); 
const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository,reviewRepository,awsUploader);
const courseController = new CourseController(courseService)

server.addService(courseProto.CourseService.service, {
    AddReview:courseController.addReview.bind(courseController),
    EditCourse: courseController.editCourse.bind(courseController),
    UploadImage: courseController.uploadImage.bind(courseController),
    UploadVideo: courseController.uploadVideo.bind(courseController),
    FetchCourse: courseController.fetchCourse.bind(courseController),  
    DeleteCourse: courseController.deleteCourse.bind(courseController),
    SubmitCourse: courseController.uploadCourse.bind(courseController), 
    GetCourseByIds: courseController.getCoursesByIds.bind(courseController),
    FetchTutorCourse: courseController.fetchTutorCourses.bind(courseController), 
    AddPurchasedUsers: courseController.addToPurchasedList.bind(courseController),
    FetchCourseDetails: courseController.fetchCourseDetails.bind(courseController),
    FetchReviewsOfCourse: courseController.fetchReviewsOfCourse.bind(courseController),
    FetchPurchasedCourses: courseController.fetchPurchasedCourses.bind(courseController),
    Test: courseController.test.bind(courseController),
})

// Start Kafka consumer
courseController.start()
  .catch(error => console.error('Failed to start kafka course service:', error));
 
const PORT = configs.PORT;  
app.listen(PORT, () => {
  console.log(`Course service running on port ${PORT}`);
}); 
 