import express from "express";
const router = express.Router();

import  {asyncErrorHandler} from "../middleware";
import {
  getAuth,
  getLoginSuccess,
  createUser,
  loginUser,
  logoutUser,
  resetCredentials,
  getResetForm,
  updatePassword,
} from"../controllers/auth";
import {
  resetValidationRules,
  updatePasswordValidationRules,
  userSignupValidationRules,
  userLoginValidationRules,
  validate,
} from "../validators";

import passport from"../passport";

router.get("/", asyncErrorHandler(getAuth));
router.get("/login/success", asyncErrorHandler(getLoginSuccess));
router.post(
  "/signup",
  userSignupValidationRules(),
  validate,
  asyncErrorHandler(createUser)
);
router.post(
  "/login",
  userLoginValidationRules(),
  validate,
  passport.authenticate("local"),
  asyncErrorHandler(loginUser)
);
router.post("/logout", logoutUser);
router.post(
  "/reset",
  resetValidationRules(),
  validate,
  asyncErrorHandler(resetCredentials)
);
router.get("/reset/:token", asyncErrorHandler(getResetForm));
router.put(
  "/updatePassword",
  updatePasswordValidationRules(),
  validate,
  asyncErrorHandler(updatePassword)
);

export {router as default}