import { CourseService } from "../services/CourseService";


const courseService = new CourseService()


export class courseController {

    async upload(call: any, callback: any) {
        try {
            console.log(call.request.videoBinary,' call from controller');

            const data = call.request;
            const response = courseService.uploadVideo(data)


        } catch (err) {
            callback(err)
        }
    }
}    