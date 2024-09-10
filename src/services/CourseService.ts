import { uploadFile, uploadImage } from "../Configs/DB.configs/s3";
import dotenv from "dotenv";
dotenv.config();

export class CourseService {

    async uploadVideo(data: any): Promise<{ success:boolean; message?: string, s3Url?: string }> {
        try {
            console.log(Buffer.byteLength(data.videoBinary), 'Video size in bytes');
            const response = await uploadFile(data.videoBinary);
            console.log('File uploaded! Public URL:', response.publicUrl);
            return { message: "Video uploaded successfully", s3Url: response.publicUrl, success:true };
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('File upload failed:', error.message);
                return { success:false, message: `File upload failed: ${error.message}` };
            } else {
                console.error('An unknown error occurred:', error);
                return { success:false, message: 'File upload failed: Unknown error' };
            }
        }
    }

    async uploadImage(data: any):Promise<{ success:boolean; message: string, s3Url?: string }> {
        try{
            console.log(data, 'serviceCourse...............')
            const response = await uploadImage(data.imageBinary,data.imageName)
            console.log('File uploaded! Public URL:', response.publicUrl);
            return {message: "Image uploaded successfully.", s3Url: response.publicUrl, success:true};
        }catch(error){
            if (error instanceof Error) {
                console.error('File upload failed:', error.message);
                return { success:false, message: `File upload failed: ${error.message}` };
            } else {
                console.error('An unknown error occurred:', error);
                return { success:false, message: 'File upload failed: Unknown error' };
            }
        }
    }
}
