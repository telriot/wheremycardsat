import { Deck } from "../models/Deck";
import { User } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { IRequestWithUser } from "../@types/index";

export const getAllDecks = async (
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
) => {
	const { cardname, ...targetParam } = req.body;
	const [[target, quantity]] = Object.entries(targetParam);
	const param = `deckList.${cardname}.${target}`;
	const updateObj = { [param]: quantity };
	const deck = await Deck.findByIdAndUpdate(req.params.id, updateObj);

	if (!deck) {
		res.status(404).send("No deck to update");
		return;
	}
	const user = await User.findById(deck.author).populate("decks").exec();
	if (!user) {
		res.status(404).send("No user to be found");
		return;
	}
	res
		.status(200)
		.json({ message: "Deck succesfully updated", updatedDecks: user.decks });
};

export const moveCardsBetweenDecks = async (
	req: IRequestWithUser,
	res: Response,
	next: NextFunction
) => {
	const { updates, authorID } = req.body;
	updates.forEach(
		async (update: {
			deckID: string;
			cardname: string;
			availability: number;
		}) => {
			const param = `deckList.${update.cardname}.availability`;
			const parsedUpdate = { [param]: update.availability };
			const deckToUpdate = await Deck.findByIdAndUpdate(
				update.deckID,
				parsedUpdate
			);
			if (!deckToUpdate) {
				res.status(404).send("No deck to update");
				return;
			}
		}
	);
	const user = await User.findById(authorID).populate("decks").exec();
	if (!user) {
		res.status(404).send("No user to be found");
		return;
	}
	res
		.status(200)
		.json({ message: "Decks succesfully updated", updatedDecks: user.decks });
};

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
export const deleteDeck = async (
	req: IRequestWithUser,
	res: Response,
	next: NextFunction
) => {
	const deck = await Deck.findByIdAndDelete(req.params.id);
	if (!deck) {
		res.status(404).send("No deck to delete");
		return;
	}
	const user = await User.findById(deck.author).populate("decks").exec();
	if (!user) {
		res.status(404).send("No user to be found");
		return;
	}

	res
		.status(200)
		.json({ message: "Deck succesfully deleted", updatedDecks: user.decks });
};
