import { MulterRequest } from "./../types";
import { NextFunction, Request, Response } from "express";
import { IGetUserAuthInfoRequest } from "../types";
import postService from "../services/postService";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const posts = await postService.getAll();
		return res.json(posts);
	} catch (err) {
		next(err);
	}
};

const create = async (
	req: IGetUserAuthInfoRequest & MulterRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		console.log("req.files", req.files);

		const image = req.file.path;

		const post = await postService.create(req.user!.id, { image });

		return res.json(post);
	} catch (err) {
		next(err);
	}
};

export default { create, getAll };
