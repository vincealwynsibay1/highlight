import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";
import { Types } from "mongoose";
import { uploadImage } from "../utils/cloudinary";

// register
const create = async (userParam: IUser) => {
	if (
		(await User.findOne({ username: userParam.username })) ||
		(await User.findOne({ email: userParam.email }))
	) {
		throw `Username or Email is already taken`;
	}
	const newUser = new User(userParam);

	if (userParam.password) {
		newUser.password = await bcrypt.hash(userParam.password, 10);
	}

	await newUser.save();
};

// login
const authenticate = async (email: string, password: string) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw "User does not exist";
	}

	const valid = bcrypt.compare(password, user.password);

	if (!valid) {
		throw "Incorrect Credentials";
	}

	const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, {
		expiresIn: "7d",
	});

	return { user, token };
};

const getAll = async () => {
	return await User.find({});
};

const getById = async (id: string) => {
	return await User.findById(id);
};
const getCurrent = async (id: string) => {
	return await User.findById(id);
};

// update user's username, password, bio, display name, or email
const update = async (id: string, userParam: any) => {
	const user = await User.findById(id);

	if (!user) {
		throw new Error("User does not exist");
	}

	if (
		user.username !== userParam.username &&
		(await User.findOne({ username: userParam.username }))
	) {
		throw new Error(`Username ${userParam.username} already taken`);
	}

	if (userParam.avatar) {
		const url = await uploadImage(userParam.avatar);
		userParam.avatar = url;
	}

	if (!userParam.bio) {
		userParam.bio = user.bio;
	}

	if (userParam.password) {
		userParam.password = bcrypt.hash(userParam.password, 10);
	}

	Object.assign(user, userParam);

	await user.save();
};

const updateAvatar = async (id: string, avatar: any) => {
	const user = await User.findById(id);

	if (!user) {
		throw "User not found";
	}
	const url = await uploadImage(avatar);

	if (url) {
		user.avatar = url;
	}

	await user.save();
};

// delete user
const _delete = async (id: string) => {
	return await User.findByIdAndRemove(id);
};

// follow
const follow = async (id: string, currentUserId: Types.ObjectId) => {
	const user = await User.findById(id);
	const currentUser = await User.findById(currentUserId);

	if (!user) {
		throw "User not found";
	}

	if (
		user.followers.some(
			(follower) => follower.toString() === currentUserId.toString()
		)
	) {
		throw "User already followed";
	}

	user.followers.unshift(currentUserId);
	currentUser?.following.unshift(new Types.ObjectId(id));
	await user.save();
	await currentUser?.save();
};

// unfollow
const unfollow = async (id: string, currentUserId: Types.ObjectId) => {
	const user = await User.findById(id);
	const currentUser = await User.findById(currentUserId);

	if (!user) {
		throw "User not found";
	}

	if (!currentUser) {
		return;
	}

	if (
		!user.followers.some(
			(follower) => follower.toString() === currentUserId.toString()
		)
	) {
		throw "User not followed yet";
	}

	user.followers = user.followers.filter(
		(follower) => follower.toString() !== currentUserId.toString()
	);

	currentUser.following = currentUser.following.filter(
		(following) => following.toString() !== id.toString()
	);

	await user.save();
	await currentUser.save();
};

const getFollowers = async (id: string) => {
	return await User.findById(id).populate("followers");
};

const getFollowing = async (id: string) => {
	return await User.findById(id).populate("following");
};

export default {
	authenticate,
	create,
	update,
	_delete,
	getAll,
	getById,
	getCurrent,
	follow,
	unfollow,
	getFollowers,
	getFollowing,
	updateAvatar,
};
