import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";

export const verifyAuth = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token: any = req.headers.authorization;

	try {
		if (!token) {
			throw "Token not found";
		}

		const decoded = jwt.verify(
			token.split(" ")[1],
			process.env.JWT_SECRET!
		);

		if (!decoded) {
			throw "Invalid token";
		}

		(req as any).user = await User.findById(decoded.sub);

		next();
	} catch (err) {
		next(err);
	}
};
