import { Request, Response, NextFunction, RequestHandler } from "express";
import bcrypt from "bcryptjs";
import prisma from "../utils/prisma";
import {
  BadRequestError,
  UnauthorizedError,
} from "../middlewares/errorhandler";
import { ResponseHandler } from "../utils/responsehandler";

export const register: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const requiredFields = ["email", "password", "firstName", "lastName"];

    const fieldDisplayNames = {
      email: "Email",
      password: "Password",
      firstName: "First Name",
      lastName: "Last Name",
    };

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      const errorMessage =
        missingFields.length === 1
          ? `${fieldDisplayNames[missingFields[0]]} is required`
          : `${missingFields
              .map((field) => fieldDisplayNames[field])
              .join(", ")} are required`;

      throw new BadRequestError(errorMessage);
    }

    if (password.length < 6) {
      throw new BadRequestError("Password must be at least 6 characters");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      throw new BadRequestError("User already exists");
    }

    const createdUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    const userWithoutPassword = {
      email: createdUser.email,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
    };

    ResponseHandler.success(
      res,
      userWithoutPassword,
      201,
      "User created successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const userWithoutPassword = {
      id: user.userID,
    };

    return ResponseHandler.success(
      res,
      { userId: userWithoutPassword.id },
      200,
      "Login successful"
    );
  } catch (error) {
    next(error);
  }
};
