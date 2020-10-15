import { User } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { IRequestWithUser } from "../@types/index";

export const getUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log("users");
};

export const getUser = async (
	req: IRequestWithUser,
	res: Response,
	next: NextFunction
) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		res.status(404).send("User not found");
	} else {
		res.status(200).json(user);
	}
};
export const getUserDecks = async (
	req: IRequestWithUser,
	res: Response,
	next: NextFunction
) => {
	//TODO: add info skimming by checking id correspondence
	const user = await User.findById(req.params.id).populate("decks").exec();
	if (!user) {
		res.status(404).send("User not found");
	} else {
		res.status(200).json(user.decks);
	}
};
export const updateUser = async (
	req: IRequestWithUser,
	res: Response,
	next: NextFunction
) => {
	const { dataObj } = req.body;
	const user = await User.findByIdAndUpdate(req.params.id, dataObj);
	if (!user) {
		res.status(404).send("Could not find the requested user");
	} else {
		if (!user._id.equals(req.user._id)) {
			res.status(401).send("You are not authorized to complete this operation");
			return;
		}
		const updatedUser = await User.findById(req.params.id);
		res.status(200).json(updatedUser);
	}
};
