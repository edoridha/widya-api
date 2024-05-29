const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) {
      throw {
        name: "NoToken",
        errors: [
          {
            message: "Invalid access token",
          },
        ],
      };
    }

    const payload = verifyToken(access_token);
    const verifyUser = await User.findByPk(payload.id);
    if (!verifyUser) {
      throw {
        name: "Unauthorized",
        errors: [
          {
            message: "Unauthorized user",
          },
        ],
      };
    }

    req.user = {
      id: verifyUser.id,
      name: verifyUser.name,
      email: verifyUser.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};
