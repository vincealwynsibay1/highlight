import { cloudinaryUpload, uploadImage } from "./utils/cloudinary";
import { errorHandler } from "./utils/errorHandler";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
const express = require("express");
const app = express();

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);

app.get("/ping", (_req, res) => {
	res.json({ message: "ping" });
});

app.post(
	"/uploadImage",
	cloudinaryUpload.single("avatar"),
	async (req, res) => {
		if (req.file?.path) {
			const url = await uploadImage(req.file!.path);
		}
		res.json({ message: "nice" });
	}
);

app.post(
	"/uploadImages",
	cloudinaryUpload.array("photos", 12),
	async (req, res) => {
		const files = (req.files as any).map((file: any) => file.path);
		for (let i = 0; i < files.length; i++) {
			files[i] = await uploadImage(files[i]);
		}
		console.log(files);
		console.log(req.body.oten);

		res.send("nice cock");
	}
);

app.use(morgan("dev"));

// Start the server
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`[server] running on http://localhost:${PORT}`);
});
