import { Deck } from "../models/Deck";
import { User } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { IRequestWithUser } from "../@types/index";

export const getDecks = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log("Decks");
};
export const getDeck = async (
	req: IRequestWithUser,
	res: Response,
	next: NextFunction
) => {};
export const updateDeck = async (
	req: IRequestWithUser,
	res: Response,
	next: NextFunction
) => {};
export const createDeck = async (
	req: IRequestWithUser,
	res: Response,
	next: NextFunction
) => {
	const { deckList, name, format } = req.body;
	const author = await User.findById(req.params.id);
	if (!author) {
		res.status(404).send("You have to login to register a new deck");
		return null;
	}
	const newDeck = await Deck.create({ deckList, name, format, author });
	await author.decks.push(newDeck);
	await author.save();
	res.status(200).send("Deck successfully created");
};
