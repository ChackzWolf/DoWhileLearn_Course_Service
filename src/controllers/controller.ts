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
}    