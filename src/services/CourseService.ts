import { uploadFile } from "../Configs/DB.configs/s3";
import dotenv from "dotenv";
dotenv.config();

export class CourseService {
    
    async uploadVideo(data: any) {
        const uploadParams = {
            Bucket: 'dowhilelearn',
            Key: `${Date.now()}-video.mp4`, // Unique file name
            Body: data.videoBinary,         // Video file buffer from gRPC request
            ContentType: 'video/mp4',       // Optional, set the content type
        };
          
        try {
            console.log(data, 'dataaa');
            console.log(Buffer.byteLength(data.videoBinary), 'Video size in bytes');
            
            const result = await uploadFile(uploadParams)


            console.log('File uploaded successfully:', result);
            return {message:"File has been uploaded successfully", success: true, s3Url: result.publicUrl}
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('File upload failed:', error.message);
                throw new Error(`File upload failed: ${error.message}`);
            } else {
                console.error('An unknown error occurred:', error);
                throw new Error('File upload failed: Unknown error');
            }
        }
    }

    // async uploadImage(data: any):Promise<{ success:boolean; message: string, s3Url?: string }> {
    //     // try{
    //     //     console.log(data, 'serviceCourse...............')
    //     //     const response = await uploadImage(data.imageBinary,data.imageName)
    //     //     console.log('File uploaded! Public URL:', response.publicUrl);
    //     //     return {message: "Image uploaded successfully.", s3Url: response.publicUrl, success:true};
    //     // }catch(error){
    //     //     if (error instanceof Error) {
    //     //         console.error('File upload failed:', error.message);
    //     //         return { success:false, message: `File upload failed: ${error.message}` };
    //     //     } else {
    //     //         console.error('An unknown error occurred:', error);
    //     //         return { success:false, message: 'File upload failed: Unknown error' };
    //     //     }
    //     // }
    // }
}
