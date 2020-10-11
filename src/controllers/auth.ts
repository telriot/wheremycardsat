import {Request, Response, NextFunction} from "express"
import crypto from "crypto"
import bcrypt from "bcrypt";
import {User} from "../models/User";
import { IRequestWithUser} from "../@types/index"
const BCRYPT_SALT_ROUNDS = 10;


export const getAuth= async (req:Request, res:Response, next:NextFunction) => {
    console.log("auth");
  }
 export const getLoginSuccess= async (req:IRequestWithUser, res:Response, next:NextFunction) => {
    if (req.user) {
      res.status(200).json({
        success: true,
        message: "user has successfully authenticated",
        user: req.user,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "no authenticated user",
        user: null,
      });
    }
  }

  export const createUser= async (req:IRequestWithUser, res:Response, next:NextFunction) => {
    const { username, password, email } = req.body;
    const user = await User.findOne({ username });
    const emailIsTaken = await User.findOne({ email });
    if (emailIsTaken) {
      res.status(200).json({
        success: false,
        message: `The email '${email}' is already in use`,
      });
      return;
    }
    if (user) {
      res.status(200).json({
        success: false,
        message: `The username '${username}' is already in use`,
      });
      return;
    } else {
      const newUser = await new User({
        username,
        password,
        email,
      });
      newUser.save();
      res.status(200).json({
        success: true,
        message: "User succesfully registered",
        user: newUser,
      });
    }
  }

  export const loginUser= async (req:IRequestWithUser, res:Response, next:NextFunction) => {
    const { _id, username, email } = req.user;
    const user = { _id, username, email };
    res.status(200).json({ success: true, user });
  }

  export const logoutUser= async (req:Request, res:Response, next:NextFunction) => {
    if (req.user) {
      req.logout();
      console.log("logging out");
      res.status(200).json({ success: true, msg: "logged out" });
    } else {
      console.log("no user to log out");
      res.status(404).json({ success: false, msg: "no user to log out" });
    }
  }
  export const resetCredentials= async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body, "BODY");
    const token = await crypto.randomBytes(20).toString("hex");
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000,
      }
    );
    if (!user) {
      console.error("email not in database");
      res.status(403).json({ success: false, msg: "Email is not registered" });
      return;
    }
    //EMAIL LOGIC WITH NODEMAIL
    res.status(200).json({ success: true, msg: "Password reset link sent" });
  }

  export const getResetForm = async (req:Request, res:Response, next:NextFunction) => {
    const user= await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      console.log("Password reset link is invalid or has expired");
      res.status(404).json({
        success: false,
        msg: "Password reset link is invalid or has expired",
      });
      return;
    }
    res.status(200).json({
      success: true,
      username: user.username,
      message: "Password reset link a-ok",
    });
  }
  export const updatePassword= async (req:Request, res:Response, next:NextFunction) => {
    const hashedPassword = await bcrypt.hash(
      req.body.password,
      BCRYPT_SALT_ROUNDS
    );
    const user = await User.findOneAndUpdate(
      { username: req.body.username },
      {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
      }
    );
    if (!user) {
      res.send(404).json({ success: false, msg: "No user to update" });
      return;
    }
    res.status(200).json({ success: true, msg: "Password updated" });
  }

