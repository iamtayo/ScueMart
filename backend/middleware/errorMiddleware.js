const notFound = (req,res,next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

const errorHandler = (err,req,res,next) => {
    let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    let message = err.message;

    //Check for mongoose bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        message = 'Resource not found';
        statusCode = 404;
    }
    res.status(404).json({
        message,
        stack : process.env.NODE_ENV === 'production' ? "pancake" : err.stack
    }) ;
    
};

export {notFound,errorHandler};

