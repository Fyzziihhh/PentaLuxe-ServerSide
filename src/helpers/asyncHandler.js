export const asyncHandler = (requestHandler) => async (req, res, next) => {
    try {
        await requestHandler(req, res, next);
    } catch (error) {
        if (!res.headersSent) {  // Check if headers have already been sent
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({
                success: false,
                message: error.message,
            });
        } else {
            next(error);  // If headers have been sent, pass the error to the next middleware
        }
    }
};
