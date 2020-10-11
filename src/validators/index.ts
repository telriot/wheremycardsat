import {Request, Response, NextFunction} from "express"
import { check, validationResult } from "express-validator";

const checkString = (target:string, min:number, max:number) =>
  check(target)
    .isString()
    .isLength({ min })
    .withMessage(`at least ${min} characters long`)
    .isLength({ max })
    .withMessage(`at most ${max} characters long`);
const matchString = (target:string, regex:string) =>
  check(target).isString().matches(regex).withMessage("Data format invalid");

const username = checkString("username", 2, 30);
const password = checkString("password", 4, 30);
const authEmail = check("email").isEmail().withMessage("invalid email address");

const email = check("dataObj.email")
  .isEmail()
  .withMessage("invalid email address");


export const userSignupValidationRules= () => {
    return [username, authEmail, password];
  }

  export const userLoginValidationRules = () => {
    return [username, password];
  }

  export const updateUserValidationRules = () => {
    return [email];
  }

  export const 
  resetValidationRules = () => {
    return [authEmail];
  }

  export const updatePasswordValidationRules = () => {
    return [password];
  }

  export const validate = (req:Request, res:Response, next:NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const extractedErrors:Array<any> = [];
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
    return res.status(422).json({
      errors: extractedErrors,
    });
  }
