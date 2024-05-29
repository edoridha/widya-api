const { User, Book } = require("../models");
const { generateToken } = require("../helpers/jwt");
const bcrypt = require("bcrypt");

class Controller {
  static async createUser(req, res, next) {
    try {
      const { name, email, gender, password } = req.body;

      await User.create({ name, email, gender, password });

      res.status(201).json({
        status: true,
        statuCode: "Created",
        message: "Successfully create user",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.user;

      const user = await User.findByPk(id);
      if (!user) {
        throw {
          name: "NotFound",
          errors: [
            {
              message: "user not found",
            },
          ],
        };
      }
      res.status(200).json({
        status: true,
        statuCode: "OK",
        message: "Successfully fetch user",
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { id } = req.user;
      const { currentPassword, newPassword } = req.body;

      const user = await User.findByPk(id);

      const verifyPassword = bcrypt.compareSync(currentPassword, user.password);
      if (!verifyPassword) {
        throw {
          name: "Bad Request",
          errors: [
            {
              message: "Invalid current password",
            },
          ],
        };
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newPassword, salt);

      await User.update({ password: hash }, { where: { id } });

      res.status(200).json({
        status: true,
        statuCode: "OK",
        message: "Success change password",
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw {
          name: "Bad Request",
          errors: [
            {
              message: "input email/password",
            },
          ],
        };
      }

      const verifyUser = await User.findOne({ where: { email } });
      if (!verifyUser) {
        throw {
          name: "Bad Request",
          errors: [
            {
              message: "Invalid email/password",
            },
          ],
        };
      }

      const verifyPassword = bcrypt.compareSync(password, verifyUser.password);

      if (!verifyPassword) {
        throw {
          name: "Bad Request",
          errors: [
            {
              message: "Invalid email/password",
            },
          ],
        };
      }

      const access_token = generateToken(verifyUser);

      res.status(200).json({
        status: true,
        statuCode: "OK",
        message: "Success to login",
        access_token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createBook(req, res, next) {
    try {
      const { title, author, price } = req.body;
      const { id } = req.user;

      await Book.create({ title, author, price, userId: id });

      res.status(201).json({
        status: true,
        statuCode: "Created",
        message: "Successfully create book",
      });
    } catch (error) {
      next(error);
    }
  }

  static async bookList(req, res, next) {
    try {
      const userId = req.user.id;
      const { page, limit } = req.query;
      const option = {
        limit: Number(limit),
        offset: Number(page) * Number(limit),
        where: { userId },
        order: [["title", "ASC"]],
      };
      const books = await Book.findAll(option);
      const totalItem = await Book.count({ where: { userId } });

      const pagination = {
        currentPage: parseInt(page, 10),
        totalItem,
      };

      res.status(200).json({
        status: true,
        statuCode: "OK",
        message: "Successfully fetch books",
        books,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateBook(req, res, next) {
    try {
      console.log("masuk controlleeeeeer");
      const { id } = req.params;
      const { title, author, price } = req.body;
      console.log(id, title, author, price, "<<<<<<<<");
      const verifyBook = await Book.findByPk(id);

      if (!verifyBook) {
        throw {
          name: "NotFound",
          errors: [{ message: "book not found" }],
        };
      }

      await Book.update({ title, author, price }, { where: { id } });

      res.status(200).json({
        status: true,
        statuCode: "OK",
        message: `Successfully update ${verifyBook.title} with id ${verifyBook.id}`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteBook(req, res, next) {
    try {
      const { id } = req.params;

      const verifyBook = await Book.findByPk(id);

      if (!verifyBook) {
        throw {
          name: "NotFound",
          errors: [{ message: "book not found" }],
        };
      }

      await Book.destroy({ where: { id } });

      res.status(200).json({
        status: true,
        statuCode: "OK",
        message: `Successfully delete ${verifyBook.title} with id ${verifyBook.id}`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBookById(req, res, next) {
    try {
      const { id } = req.params;

      const book = await Book.findByPk(id);
      if (!book) {
        throw {
          name: "NotFound",
          errors: [
            {
              message: "Book not found",
            },
          ],
        };
      }

      res.status(200).json({
        status: true,
        statuCode: "OK",
        message: "Successfully get books",
        book,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
