import express from "express";
const router = express.Router();
import { asyncErrorHandler } from "../middleware";
import {
	getDecks,
	getDeck,
	updateDeck,
	createDeck,
} from "../controllers/decks";
import { validate } from "../validators";

router.get("/", asyncErrorHandler(getDecks));
router.get("/:id", asyncErrorHandler(getDeck));
router.put("/:id", asyncErrorHandler(updateDeck));
router.post("/:id", asyncErrorHandler(createDeck));
export { router as default };
