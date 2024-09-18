import { uploadFile, uploadImage } from "../Configs/DB.configs/s3";
import dotenv from "dotenv";
import CourseRepository, { CourseDetails, ResponseFetchCourseList } from "../Repository/courseRepositories"
dotenv.config();

const repository = new CourseRepository()

export class CourseService {
    
    async uploadVideo(data: any) {
          
        try {
            console.log(data, 'dataaa');
            console.log(Buffer.byteLength(data.videoBinary), 'Video size in bytes');
            const result = await uploadFile(data.videoBinary)
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

    async uploadImage(data: any):Promise<{ success:boolean; message: string, s3Url?: string }> {
        try{
            const response = await uploadImage(data.imageBinary,data.imageName)
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
    
    async uploadCourse(data:any){
        try{
            console.log(data, 'data form service')
            const uploadData = await repository.createCourse(data);
            console.log(uploadData, 'uploaded data ');
            return {success: true, message: "Course succesfully uploaded."}
        }catch(error){
            console.error('An unknown error occurred:', error);
            return { success:false, message: 'Course upload failed:  error' };
        }
    }
 
    async fetchCourse(){
        try {
            console.log('trig')
            const fetchCourse = await repository.getCourses();
            console.log(fetchCourse, "fetched course ")
            return fetchCourse
        } catch (error) {
            console.error("An unknown error occured: ", error );    
            return { success: false, message: "Course fetch error"}
        }
    }

    async fetchTutorCourses(data:{tutorId:string}): Promise<{ success: boolean, courses?: ResponseFetchCourseList}> {
        try {
            const courses = await repository.fetchTutorCourses(data.tutorId);
            console.log(courses, 'courses forms service')
            return { success: true, courses }; // Courses should match ResponseFetchCourseList type
        } catch (error) {
            return { success: false };
        }
    }

    async fetchCourseDetails(data:{id:string}){
        try{
            const courseDetails = await repository.findCourseById(data.id);
            console.log(courseDetails, 'course detsils in usecAse')
            return  courseDetails;

        }catch(error){
            console.log(error)
        }
    }
}
 