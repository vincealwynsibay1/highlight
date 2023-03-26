import { Schema, model, Types } from "mongoose";

export interface IUser {
	username: string;
	password: string;
	email: string;
	created_at: string;
	displayName: string;
	bio: string;
	avatar: string;
	followers: Types.ObjectId[];
	following: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
	},
	email: {
		type: String,
		required: true,
	},

	displayName: {
		type: String,
		default: "",
	},
	bio: {
		type: String,
		default: "",
	},
	followers: [
		{
			type: Types.ObjectId,
			ref: "User",
		},
	],
	following: [
		{
			type: Types.ObjectId,
			ref: "User",
		},
	],
	created_at: {
		type: String,
		default: Date(),
	},
});

userSchema.set("toJSON", {
	virtuals: true,
	versionKey: false,
	transform: function (doc, ret) {
		delete ret._id;
		delete ret.password;
	},
});

const User = model<IUser>("User", userSchema);

export default User;
