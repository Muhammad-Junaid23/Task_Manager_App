import { ZodError } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import {
  userCreateSchema,
  userUpdateSchema,
} from "../validations/userValidation.js";
import AppError from "../utils/AppError.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res, next) => {
  try {
    const validatedData = userCreateSchema.parse(req.body);

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return next(new AppError("Email already exist", 400));
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    const user = await User.create({
      ...validatedData,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(201).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues[0]?.message || "Invalid input";
      return next(new AppError(message, 400));
    }
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = userUpdateSchema.parse(req.body);

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return next(new AppError("User not found", 404));
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true, runValidators: true },
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues[0]?.message || "Invalid input";
      return next(new AppError(message, 400));
    }
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

export const getProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("email and password are required", 400));
    }

    const userr = await User.findOne({ email }).select("+password");
    if (!userr) {
      return next(new AppError("Invalid Email", 401));
    }

    const comparePassword = await bcrypt.compare(password, userr.password);
    if (!comparePassword) {
      return next(new AppError("Invalid password", 401));
    }

    const token = jwt.sign(
      { id: userr._id, email: userr.email },
      process.env.JWT_TOKEN_SECRET,
      { expiresIn: "1d" },
    );
    console.log("token", token);

    const { password: _, ...user } = userr.toObject();
    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};
