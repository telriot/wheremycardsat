import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./User";
export interface IDeck extends Document {
	name: string;
	format: string;
	author: IUser;
	deckList: any;
}

const DeckSchema: Schema = new Schema({
	name: String,
	format: String,
	author: { type: Schema.Types.ObjectId, ref: "User" },
	deckList: Object,
	date: {
		type: Date,
		default: Date.now,
	},
});

export const Deck = mongoose.model<IDeck>("Deck", DeckSchema);
