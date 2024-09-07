import { uploadFile } from "../Configs/DB.configs/s3";
import dotenv from "dotenv"
dotenv.config()

export class CourseService {
    
    async uploadVideo(data:any) {

        


        const uploadParams = {
            Bucket: 'dowhilelearn',
            Key: `${Date.now()}-video.mp4`, // unique file name
            Body: data.videoBinary,              // video file buffer from gRPC request
            ContentType: 'video/mp4'        // optional, set the content type
          };
          
          try {

            console.log(data, 'dataaa')
            console.log(Buffer.byteLength(data.videoBinary), 'Video size in bytes');
            const result = await uploadFile(uploadParams);
            console.log('File uploaded successfully:', result);
          } catch (error) {
            console.error('File upload failed:', error);
          }
    }

}