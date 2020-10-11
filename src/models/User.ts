import mongoose, { Document, Schema, Types } from "mongoose";
import { IDeck } from "./Deck";
import bcrypt from "bcrypt";
type TCheckPassword = (inputPassword: string) => boolean;
type THashPassword = (plainTextPassword: string) => string;

export interface IUser extends Document {
	_id: Types.ObjectId;
	username: string;
	password: string;
	email: string;
	decks: Array<IDeck>;
	resetPasswordToken?: string;
	resetPasswordExpires?: number;
	date?: Date;
	checkPassword: TCheckPassword;
	hashPassword: THashPassword;
}

const UserSchema: Schema = new Schema({
	username: String,
	password: String,
	email: String,
	decks: [{ type: Schema.Types.ObjectId, ref: "Deck" }],
	resetPasswordToken: String,
	resetPasswordExpires: String,
	date: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.methods = {
	checkPassword: function (inputPassword: string) {
		return bcrypt.compareSync(inputPassword, this.password);
	},
	hashPassword: (plainTextPassword: string) => {
		return bcrypt.hashSync(plainTextPassword, 10);
	},
};

UserSchema.pre<IUser>("save", function (next) {
	if (!this.isModified("password")) {
		return next();
	} else {
		this.password = this.hashPassword(this.password);
		next();
	}
});

export const User = mongoose.model<IUser>("User", UserSchema);
