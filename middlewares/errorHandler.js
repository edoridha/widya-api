function errorHandler(error, req, res) {
  let message = {
    status: false,
    statusCode: "FAILED",
    message: "Internal Server Error",
  };
  let code = 500;

  switch (error.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
    case "Bad Request":
      code = 400;
      message = {
        status: false,
        statusCode: "Bad Request",
        message: error.errors[0].message,
      };
      break;
    case "JsonWebTokenError":
      code = 401;
      message = {
        status: false,
        statusCode: "Unauthorized",
        message: "Invalid access token",
      };
      break;
    case "NoToken":
    case "Unauthorized":
      code = 401;
      message = {
        status: false,
        statusCode: "Unauthorized",
        message: error.errors[0].message,
      };
      break;
    case "NotFound":
      code = 404;
      message = {
        status: false,
        statusCode: error.name,
        message: error.errors[0].message,
      };
      break;
  }
  console.log(error, '<<<<<<<<<<');
  res.status(code).json(message);
}

module.exports = errorHandler;
