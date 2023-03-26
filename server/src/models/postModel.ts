import { model, ObjectId, Schema, Types } from "mongoose";

export interface IPost {
	user: ObjectId;
	imageUrl: string;
	createdAt: String;
}

const postSchema = new Schema<IPost>({
	user: {
		type: Types.ObjectId,
		ref: "User",
	},
	imageUrl: {
		type: String,
		required: true,
	},
	createdAt: {
		type: String,
		default: new Date(),
	},
});

postSchema.set("toJSON", {
	virtuals: true,
	versionKey: false,
});

const Post = model<IPost>("Post", postSchema);

export default Post;
