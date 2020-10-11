import express from "express";
const router = express.Router();
import { asyncErrorHandler, } from "../middleware";
import { getUsers, getUser, updateUser } from "../controllers/users";
import { updateUserValidationRules, validate } from "../validators";

router.get("/", asyncErrorHandler(getUsers));
router.get("/:id",  asyncErrorHandler(getUser));
router.put(
  "/:id",
  updateUserValidationRules(),
  validate,
  asyncErrorHandler(updateUser)
);

export {router as default}