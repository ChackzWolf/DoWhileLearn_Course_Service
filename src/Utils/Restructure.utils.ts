import { IPlainCourse, IModule, ILesson, Question, MultipleChoiceQuestion, CodingQuestion } from '../Interfaces/Models/ICourse'; // Adjust path as needed


export function restructureSubmitCourse(grpcResponse: any): IPlainCourse {
    // Start constructing the base course object without _id
    const course: IPlainCourse = {
      tutorId: grpcResponse.tutorId,
      courseCategory: grpcResponse.courseCategory,
      courseDescription: grpcResponse.courseDescription,
      courseLevel: grpcResponse.courseLevel,
      coursePrice: grpcResponse.coursePrice,
      courseTitle: grpcResponse.courseTitle,
      demoURL: grpcResponse.demoURL,
      discountPrice: grpcResponse.discountPrice,
      thumbnail: grpcResponse.thumbnail,
      purchasedUsers: [], // Add logic if purchasedUsers exist in response
      benefits_prerequisites: {
        benefits: grpcResponse.benefits_prerequisites?.benefits || [],
        prerequisites: grpcResponse.benefits_prerequisites?.prerequisites || [],
      },
      Modules: grpcResponse.Modules.map((module: any): IModule => ({
        name: module.name,
        description: module.description,
        lessons: module.lessons.map((lesson: any): ILesson => ({
          title: lesson.title,
          video: lesson.video,
          description: lesson.description,
          questions: lesson.questions?.map((question: any): Question | null => {
            // Handle "QUIZ" type questions
            if (question.type === 'QUIZ') {
              const quizQuestion: MultipleChoiceQuestion = {
                id: question.id,
                type: 'QUIZ',
                question: question.question,
                completedUsers:[],
                options: question.options || [],
                difficulty: question.difficulty,
                correctAnswer: question.correctAnswer || '',
              };
              return quizQuestion;
            }
   
            // Handle "CODING" type questions
            if (question.type === 'CODING') {
              const codingQuestion: CodingQuestion = {
                id: question.id,
                type: 'CODING',
                question: question.question,
                difficulty:question.difficulty,
                solution:question.solution,
                completedUsers:[],
                startingCode: question.startingCode || '',
                noOfParameters: question.noOfParameters || 0,
                parameters: (question.parameters || []).map((param: any) => ({
                  value: param.value,
                  dataType: param.dataType,
                })),
                expectedOutput: {
                  value: question.expectedOutput?.value || '',
                  dataType: question.expectedOutput?.dataType || '',
                },
                hints:question.hints,
                testCases: (question.testCases || []).map((testCase: any) => ({
                  parameters: testCase.parameters.map((param: any) => ({
                    value: param.value,
                    dataType: param.dataType,
                  })),
                  expectedValue: {
                    value: testCase.expectedValue?.value || '',
                    dataType: testCase.expectedValue?.dataType || '',
                  },
                })),
              };
              return codingQuestion;
            }
  
            // Return null for unsupported question types
            return null;
          })?.filter((q: any): q is Question => q !== null), // Filter out null values
        })),
      })),
    };
  
    // Add _id field only if it exists in grpcResponse
    if (grpcResponse._id) {
      course._id = grpcResponse._id;
    }
  
    return course;
  }
  