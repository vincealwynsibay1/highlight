import { Request, Response, NextFunction } from "express";

export function errorHandler(
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (typeof err === "string") {
		return res.status(400).json({ message: err });
	}
	console.log("error", err.message ? err.message : err);

	return res.status(500).json({ message: err.message });
}
