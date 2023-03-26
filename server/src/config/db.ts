import mongoose from "mongoose";

export function connectDB() {
	const MONGO_URI =
		process.env.NODE_ENV === "production"
			? process.env.MONGO_URI_PROD
			: process.env.MONGO_URI_DEV;

	mongoose.connect(MONGO_URI!).then(() => {
		console.log("[server] database connected");
	});
}
