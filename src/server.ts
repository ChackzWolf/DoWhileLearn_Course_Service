// courseService.js
const express = require('express');
const multer = require('multer');
import dotenv from "dotenv";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { courseController } from "./controllers/controller";
import { connectDB } from "./Configs/DB.configs/mongoDB";

dotenv.config()


const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, "protos/course.proto"),
    {keepCase:true , longs: String, enums: String , defaults: true, oneofs: true}
)

const courseProto = grpc.loadPackageDefinition(packageDefinition) as any;

const server = new grpc.Server({
    'grpc.max_receive_message_length': 1 * 1024 * 1024 * 1024 // 1 GB
})



const grpcServer = () => {
    server.bindAsync(
        `0.0.0.0:${process.env.COURSE_GRPC_PORT}`,
        grpc.ServerCredentials.createInsecure(),
        (err,port)=>{
            if(err){
                console.log(err, "Error happened grpc course service.");
                return;
            }else{

                console.log("gRPC course server started on port", port);   
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
    FetchCourse: controller.fetchCourse,
})