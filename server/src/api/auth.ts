import { Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { isValidEmail, isValidString } from "../utils/auth.utils";
import multer from "multer";
import path from "path";

interface RegisterRequestBody {
    email: string;
    username: string;
    password: string;
    bio: string;
    profileImage: any;
    backgroundImage: any;
}


//register 
//login 
//image upload
//update bio 
//update username
//delete user
//get user / users



type RegisterRequest = Request<{}, {}, RegisterRequestBody>;


export class UserAPI {

  public async register(req: Request, res: Response) {
    const baseResponseInst = new BaseResponse();
    const { email, username, password, bio } = req.body;

    console.log( email, username, password, bio )
  
    const files : any = req.files 
    const profileImage = files?.profileImage?.[0];
    const backgroundImage = files?.backgroundImage?.[0];
  
    if (!profileImage || !backgroundImage) {
      baseResponseInst.setValue(400, "Missing profile or background image", null);
      return res.status(400).json(baseResponseInst.buildResponse());
    }
  
    if (!isValidEmail(email, 1, 100) || !isValidString(username, 1, 100) || !isValidString(password, 1, 100)) {
      baseResponseInst.setValue(400, "Invalid input", null);
      return res.status(400).json(baseResponseInst.buildResponse());
  }
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      baseResponseInst.setValue(400, "Email already registered", null);
      return res.status(400).json(baseResponseInst.buildResponse());
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await User.create({
        userID: uuidv4(),
        email,
        username,
        password: hashedPassword,
        bio,
        profileImageURL: profileImage.path,
        backgroundImageURL: backgroundImage.path,
        inbox: [],
      });
  
      baseResponseInst.setValue(201, "User registered successfully", newUser);
      return res.status(201).json(baseResponseInst.buildResponse());
  
    } catch (error) {
      console.error("Register error:", error);
      baseResponseInst.setValue(500, "Internal server error", null);
      return res.status(500).json(baseResponseInst.buildResponse());
    }
  }
  

    public async login(req: any, res: Response) {
      const baseResponseInst = new BaseResponse();
      const { email, password } = req.body;

      if (!isValidString(email, 1, 100) || !isValidString(password, 1, 100)) {
          baseResponseInst.setValue(400, "Invalid input ", null);
          const responseData = baseResponseInst.buildResponse();
          return res.status(400).json(responseData);
      }

      const user = await User.findOne({ email });
      if (!user) {
          baseResponseInst.setValue(400, "User not found", null);
          const responseData = baseResponseInst.buildResponse();
          return res.status(400).json(responseData);
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
          baseResponseInst.setValue(400, "Password is incorrect", null);
          const responseData = baseResponseInst.buildResponse();
          return res.status(400).json(responseData);
      }

      baseResponseInst.setValue(200, "Login successful", {
          userId: user.userID,
          username: user.username,
          email: user.email
      });
      const responseData = baseResponseInst.buildResponse();
      return res.status(200).json(responseData);
  }

  public async getAllUsers(req: Request, res: Response) {
      const baseResponseInst = new BaseResponse();

      try {

          const users = await User.find({}, {
              password: 0,
              verificationToken: 0
          });

          if (!users || users.length === 0) {
              baseResponseInst.setValue(404, "No users found", []);
              return res.status(404).json(baseResponseInst.buildResponse());
          }

          baseResponseInst.setValue(200, "successfully", users);
          return res.status(200).json(baseResponseInst.buildResponse());
      } catch (error) {
          console.error("Error :", error);
          baseResponseInst.setValue(500, "Internal Server Error", null);
          return res.status(500).json(baseResponseInst.buildResponse());
      }
  }

  public async getUserById(req: Request, res: Response) {
      const baseResponseInst = new BaseResponse();
      const { userID } = req.body;

      if (!userID) {
          baseResponseInst.setValue(400, "User ID is required", null);
          return res.status(400).json(baseResponseInst.buildResponse());
      }

      try {
          const user = await User.findOne({ userID }, {
              password: 0,
              verificationToken: 0
          });

          if (!user) {
              baseResponseInst.setValue(404, "User not found", null);
              return res.status(404).json(baseResponseInst.buildResponse());
          }

          baseResponseInst.setValue(200, "success", user);
          return res.status(200).json(baseResponseInst.buildResponse());
      } catch (error) {
          console.error("Error :", error);
          baseResponseInst.setValue(500, "Internal Server Error", null);
          return res.status(500).json(baseResponseInst.buildResponse());
      }
  }

}

class BaseResponse {
    code: number;
    description: string;
    data: any;

    constructor(code: number = 200, description: string = "", data: any = null) {
        this.code = code;
        this.description = description;
        this.data = data;
    }

    buildResponse() {
        return {
            status: { code: this.code, description: this.description },
            data: this.data,
        };
    }

    setValue(code: number, description: string, data: any) {
        this.code = code;
        this.description = description;
        this.data = data;
    }
}