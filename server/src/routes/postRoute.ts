import { Router } from "express";
import { cloudinaryUpload } from "../utils/cloudinary";
import postController from "../controllers/postController";
import { verifyAuth } from "../utils/jwt";

const router = Router();

router.get("/posts/", postController.getAll);
router.post(
	"/posts/",
	verifyAuth,
	cloudinaryUpload.array("photos", 4),
	postController.create
);

export default router;
