import { Request } from "express";
export interface IGetUserAuthInfoRequest extends Request {
	user?: any; // or any other type
}

export interface MulterRequest extends Request {
	file?: any;
	files?: any;
}
