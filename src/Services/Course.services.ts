import { uploadFile, uploadImage } from "../Configs/S3/s3";
import dotenv from "dotenv";
import CourseRepository from '../Repositories/Course.repository'
import { ICourseUseCase } from "../Interfaces/IServices/IService.interfaces";
import { StatusCode } from "../Interfaces/Enums/enums";
import {
    UploadVideoDTO,
    UploadVideoResponseDTO,
    UploadImageDTO,
    UploadImageResponseDTO,
    UpdateCourseDTO,
    UploadCourseResponseDTO,
    FetchCourseResponseDTO,
    FetchTutorCoursesDTO,
    FetchTutorCoursesResponseDTO,
    FetchCourseDetailsDTO,
    FetchCourseDetailsResponseDTO,
    AddToPurchasedListDTO,
    AddToPurchasedListResponseDTO,
    GetCoursesByIdsDTO,
    GetCoursesByIdsResponseDTO,
} from '../Interfaces/DTOs/IService.dto'
import { ResponseFetchCourseList } from "../Interfaces/DTOs/IRepository.dto";
dotenv.config();


const repository = new CourseRepository()

export class CourseService implements ICourseUseCase {
    async uploadVideo(data: UploadVideoDTO): Promise<UploadVideoResponseDTO> {

        try {
            console.log(data, 'dataaa');
            console.log(Buffer.byteLength(data.videoBinary), 'Video size in bytes');
            const result = await uploadFile(data.videoBinary)
            console.log('File uploaded successfully:', result);
            return { message: "File has been uploaded successfully", success: true, s3Url: result.publicUrl }
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

    async uploadImage(data: UploadImageDTO): Promise<UploadImageResponseDTO> {
        try {
            const response = await uploadImage(data.imageBinary, data.imageName)
            return { message: "Image uploaded successfully.", s3Url: response.publicUrl, success: true };
        } catch (error) {
            if (error instanceof Error) {
                console.error('File upload failed:', error.message);
                return { success: false, message: `File upload failed: ${error.message}` };
            } else {
                console.error('An unknown error occurred:', error);
                return { success: false, message: 'File upload failed: Unknown error' };
            }
        }
    }

    async uploadCourse(data: UpdateCourseDTO): Promise<UploadCourseResponseDTO> {
        try {
            console.log(data, 'data form service')
            const uploadData = await repository.createCourse(data);
            console.log(uploadData, 'uploaded data ');
            return { success: true, message: "Course succesfully uploaded." }
        } catch (error) {
            console.error('An unknown error occurred:', error);
            return { success: false, message: 'Course upload failed:  error' };
        }
    }

    async updateCourse(data: UpdateCourseDTO): Promise<UploadCourseResponseDTO> {
        try {
            console.log(data, 'data to update form service')
            const uploadData = await repository.updateCourse(data);
            console.log(uploadData, 'uploaded data ');
            return { success: true, message: "Course succesfully updated." }
        } catch (error) {
            console.error('An unknown error occurred:', error);
            return { success: false, message: 'Course update failed:  error' };
        }
    }

    async fetchCourse(): Promise<FetchCourseResponseDTO> {
        try {
            const fetchCourse: ResponseFetchCourseList = await repository.getCourses();

            return {
                success: true,
                courses: fetchCourse.courses // Return the array of courses directly
            };
        } catch (error) {
            console.error("An unknown error occurred: ", error);
            return {
                success: false,
                error: 'Failed to fetch courses. Please try again later.'
            };
        }
    }

    async fetchTutorCourses(data: FetchTutorCoursesDTO): Promise<FetchTutorCoursesResponseDTO> {
        try {
            const courses = await repository.fetchTutorCourses(data.tutorId);
            return {
                success: true,
                courses: courses.courses,  // Ensure the response matches the ResponseFetchCourseList structure
            };
        } catch (error) {
            console.error('Error fetching tutor courses:', error);
            return { success: false, message: 'Failed to fetch courses' };  // Added error message for clarity
        }
    }
    async fetchCourseDetails(data: FetchCourseDetailsDTO): Promise<FetchCourseDetailsResponseDTO> {
        try {
            const courseDetails = await repository.findCourseById(data.id);
            console.log(courseDetails, 'Course details from service');

            if (!courseDetails) {
                return { courseDetails: undefined, message: 'Course not found' };
            }

            return { courseDetails }; // Return the found course details
        } catch (error) {
            console.log(error);
            return { courseDetails: undefined, message: 'An error occurred while fetching course details' };
        }
    }

    async addToPurchasedList(data: AddToPurchasedListDTO): Promise<AddToPurchasedListResponseDTO> {
        try {
            console.log(data);
            const response = await repository.addToPurchaseList(data.userId, data.courseId);
            console.log(response);

            return {
                message: response.success ? response.message : "An error occurred while adding to the purchased list", // Provide a default message
                success: response.success,
                status: StatusCode.Created
            };
        } catch (error) {
            console.log(error);
            return {
                message: "Error occurred while creating order", // Ensure message is always a string
                success: false,
                status: StatusCode.ExpectationFailed
            };
        }
    }



    async getCoursesByIds(data: GetCoursesByIdsDTO): Promise<GetCoursesByIdsResponseDTO> {
        try {
            console.log(data, 'data from useCase');
            const courses = await repository.getCoursesByIds(data.courseIds);
            console.log(courses);

            return {
                success: true,
                courses: courses.courses, // Ensure this is correctly typed
            };
        } catch (error) {
            console.error("Error in getCoursesByIds service:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred', // Provide error details
            };
        }
    }

}
