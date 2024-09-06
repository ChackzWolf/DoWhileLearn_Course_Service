import { CourseService } from "../services/CourseService";


const courseService = new CourseService()


export class courseController {

    async upload(call: any, callback: any) {
        try {
            const data = call.request;
            const response = courseService.uploadVideo(data)
            console.log(call,' call from controller');


        } catch (err) {
            callback(err)
        }
    }
}    