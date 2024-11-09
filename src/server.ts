// courseService.js
const express = require('express');
const multer = require('multer');
import dotenv from "dotenv";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { courseController } from "./Controllers/Course.controller";
import { connectDB } from "./Configs/DB.configs/mongoDB";
import morgan from 'morgan';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs'
import { configs } from "./Configs/ENV_configs/ENV.configs";

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
    path.join(__dirname, "Protos/course.proto"),
    {keepCase:true , longs: String, enums: String , defaults: true, oneofs: true}
)

const courseProto = grpc.loadPackageDefinition(packageDefinition) as any;

const server = new grpc.Server({
    'grpc.max_receive_message_length': 1 * 1024 * 1024 * 1024 // 1 GB
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
const upload = multer({ storage: multer.memoryStorage() });

module.exports = router;
const controller = new courseController()

server.addService(courseProto.CourseService.service, {
    UploadVideo: controller.uploadVideo,
    UploadImage: controller.uploadImage,
    SubmitCourse: controller.uploadCourse,
    EditCourse: controller.editCourse,
    DeleteCourse: controller.deleteCourse,
    FetchCourse: controller.fetchCourse,
    FetchTutorCourse: controller.fetchTutorCourses,
    FetchCourseDetails: controller.fetchCourseDetails,
    AddPurchasedUsers: controller.addToPurchasedList,
    GetCourseInCart: controller.getCoursesByIds
})

// Start Kafka consumer
controller.start()
  .catch(error => console.error('Failed to start kafka course service:', error));

const PORT = configs.PORT; 
app.listen(PORT, () => {
  console.log(`Course service running on port ${PORT}`);
});
 