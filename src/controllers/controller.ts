import { CourseService } from "../services/CourseService";


const courseService = new CourseService()


export class courseController {

    async uploadVideo(call: any, callback: any) {
        try {
            console.log(call.request.videoBinary,' call from controller');

            const data = call.request;
            const response = await courseService.uploadVideo(data)
            console.log('giving response', response)
            callback(null,response); 
        } catch (err) {
            callback(err)
        } 
    }

    async uploadImage( call: any, callback: any){
        const data = call.request; 
        const response = await courseService.uploadImage(data);
        callback(null,response);
    }

    async uploadCourse ( call: any, callback: any){
        const data = call.request;
        console.log(data, 'data fro mcntorller')
         
        const response = await courseService.uploadCourse(data);
        console.log(response, 'response')
        callback(null, response)
    }

    async fetchCourse( call: any, callback: any){
        const response = await courseService.fetchCourse();
        console.log(response, "from contoller")
        callback(null, response);
    }

    async fetchTutorCourses( call: any, callback:any){
        console.log("trig")
        const data = call.request;
        console.log(data, 'from controller')
        const response = await courseService.fetchTutorCourses(data)
        console.log(response, "rsponse");
        callback(null, response.courses)
    }
}      