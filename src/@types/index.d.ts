import {Request} from "express"
import {IUser} from "../models/User"
export interface IError extends Error {
    status?: number;
  }
export interface IRequestWithUser extends Request{
    user:any
    }