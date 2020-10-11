import express from "express";
const router = express.Router();
import { asyncErrorHandler } from "../middleware";
import { getIndex } from "../controllers/index";

router.get("/", asyncErrorHandler(getIndex));

export {router as default}