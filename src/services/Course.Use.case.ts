import { uploadFile, uploadImage } from "../Configs/DB.configs/s3";
import dotenv from "dotenv";
import  { CourseDetails, ResponseFetchCourseList } from "../Interfaces/ICourse.repository"
import CourseRepository from '../Repository/Course.repository'
import { ICourseUseCase } from "../Interfaces/ICourse.Use.case";
import { StatusCode } from "../Interfaces/enums";
dotenv.config();
 

const repository = new CourseRepository()

export class CourseService implements ICourseUseCase {
    
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

    async updateCourse(data:any){
        try{
            console.log(data, 'data to update form service') 
            const uploadData = await repository.updateCourse(data);
            console.log(uploadData, 'uploaded data ');
            return {success: true, message: "Course succesfully updated."}
        }catch(error){
            console.error('An unknown error occurred:', error);
            return { success:false, message: 'Course update failed:  error' };
        }
    } 
 
    async fetchCourse(){
        try {
            const fetchCourse = await repository.getCourses(); 
            return fetchCourse
        } catch (error) {
            console.error("An unknown error occured: ", error );    
            return { success: false, message: "Course fetch error"}
        }
    }

    async fetchTutorCourses(data:{tutorId:string}): Promise<{ success: boolean, courses?: ResponseFetchCourseList}> {
        try {
            const courses = await repository.fetchTutorCourses(data.tutorId);
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

    async addToPurchasedList (data:{userId:string,courseId:string}){
        try {
            console.log(data)
            const response = await repository.addToPurchaseList(data.userId,data.courseId);
            console.log(response)
            if(response.success){
                return {message:response.message, success: true, status: StatusCode.Created}
            }else{
                return {message: "error creating order", success: false, status: StatusCode.NotFound}
            }
        } catch (error) {
            console.log(error)
            return {message :"Error occured while creating order", success: false , status: StatusCode.ExpectationFailed }
        }
    }

    async getCoursesByIds(data:{courseIds:string[]}){
        try {
            console.log(data, 'ddata form useCase')
            const courses = await repository.getCoursesByIds(data.courseIds);
            console.log(courses)
            return { success: true, courses }; // Courses should match ResponseFetchCourseList type
        } catch (error) {
            
        }
    }
}
 