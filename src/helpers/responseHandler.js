 export const createResponse = (res, statusCode, success, message='', data = null) => {
    return res.status(statusCode).json({
      success,
      message,
      data
    });
  };

  export const serverErrorResponse=(res,message="An internal server error occurred.")=>{
    return res.status(500).json({
      success:false,
      message
    })
  }