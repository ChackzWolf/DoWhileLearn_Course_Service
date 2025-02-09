export  const kafka_Const = {
    topics:{
        
        COURSE_SERVICE: process.env.COURSE_SERVICE || "course-service",
        COURSE_UPDATE: process.env.COURSE_UPDATE || "course.update",
        COURSE_ROLLBACK: process.env.COURSE_ROLLBACK || "course-service.rollback",
        COURSE_RESPONSE: process.env.COURSE_RESPONSE || "course.response",
        COURSE_ROLLBACK_COMPLETED : process.env.COURSE_ROLLBACK_COMPLETED || 'rollback-completed'
    },
    COURSE_SERVICE_GROUP_NAME: process.env.COURSE_SERVICE_GROUP || "course-service-group",
} 