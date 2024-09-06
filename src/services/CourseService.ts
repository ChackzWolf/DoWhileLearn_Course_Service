export class CourseService {
    
    async uploadVideo(data:any) {
        try{
            console.log(data, 'data form service')

        }catch(err){
            throw new Error(`Failed to signup: ${err}`);
        } 
    }
    
}