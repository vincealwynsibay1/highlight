import Post from "../models/postModel";
import endOfDay from "date-fns/endOfDay";
import startOfDay from "date-fns/startOfDay";
import { uploadImage } from "src/utils/cloudinary";

const getAll = async () => {
	return await Post.find().populate("user");
};

const create = async (userId, postParams) => {
	if (await checkIfAlreadyPostedToday(userId)) {
		return false;
	}
	const imageUrl = await uploadImage(postParams.image);
	const newPost = new Post({ imageUrl });
	return await newPost.save();
};

const checkIfAlreadyPostedToday = async (user: String) => {
	const post = await Post.find({
		createdAt: { $gte: startOfDay(new Date()), $lte: endOfDay(new Date()) },
		user,
	});

	if (post) {
		return true;
	}

	return false;
};

export default { create, getAll };
