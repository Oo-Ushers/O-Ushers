import { deleteFile } from "./file-function.js";

export class AppError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode}

    }



export const asyncHandler = (fn) => {  
    return (req,res,next) => {
        fn(req,res,next).catch((err)=>{
            return next(new AppError(err.message,err.statusCode || 500));
        })
    }
}



//global error handler

export const globalErrorHandler= (err, req, res, next) => {
    if(req.file){
        deleteFile(req.file.path);
    }
    return res.status(err.statusCode || 500).json({
        message: err.message ,
        success: false
        
    }
    );
}