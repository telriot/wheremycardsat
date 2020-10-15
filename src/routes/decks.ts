import express from "express";
const router = express.Router();
import { asyncErrorHandler } from "../middleware";
import {
	getAllDecks,
	getDeck,
	updateDeck,
	createDeck,
	deleteDeck,
	moveCardsBetweenDecks,
} from "../controllers/decks";
import { validate } from "../validators";

router.get("/", asyncErrorHandler(getAllDecks));
router.get("/:id", asyncErrorHandler(getDeck));
router.put("/:id", asyncErrorHandler(updateDeck));
router.post("/swap/", asyncErrorHandler(moveCardsBetweenDecks));
router.post("/:id", asyncErrorHandler(createDeck));
router.delete("/:id", asyncErrorHandler(deleteDeck));

export { router as default };
