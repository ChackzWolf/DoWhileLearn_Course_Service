import dotenv from 'dotenv'
dotenv.config()


export const configs = {
    // GRPC PORT CONFIG
    COURSE_GRPC_PORT : process.env.COURSE_GRPC_PORT || 5001,


    // DB COFNIGS
    MONGODB_URL_COURSE : process.env.MONGODB_URL_COURSE || '',
    
    
    //AWS CONFIGS
    BUCKET_NAME: process.env.BUCKET_NAME || '',
    AWS_ACCESS_KEY_ID : process.env.AWS_ACCESS_KEY_ID || '',
    AWS_SECRET_ACCESS_KEY : process.env.AWS_SECRET_ACCESS_KEY || '',
    AWS_REGION : process.env.AWS_REGION || '',


    // LOGGER CONFIGS
    LOG_RETENTION_DAYS : process.env.LOG_RETENTION_DAYS || '7d'
}