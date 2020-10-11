import {Request,Response,NextFunction} from "express"
import { Error } from "mongoose"
import {User} from "../models/User";
import {IError, IRequestWithUser} from "../@types/index"
  
 export const asyncErrorHandler= (fn:any) => (req:Request, res:Response, next:NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  }
export const isAuthorizedUser = async (req:IRequestWithUser, res:Response, next:NextFunction) => {
    if (!req.user) {
      let err :IError= new Error("You are not autorized to access this route");
      err.status = 401;
      return next(err);
    }
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        let err:IError = new Error("You are not autorized to access this route");
        err.status = 401;
        return next(err);
      } else {
        return next();
      }
    } catch (error) {
      return next(error);
    }
  }

