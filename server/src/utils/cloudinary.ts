import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const storage = multer.diskStorage({});
export const cloudinaryUpload = multer({ storage });

export const uploadImage = async (imagePath: string) => {
	// Use the uploaded file's name as the asset's public ID and
	// allow overwriting the asset with new versions

	const options = {
		use_filename: true,
		unique_filename: false,
		overwrite: true,
	};

	try {
		// Upload the image
		const result = await cloudinary.uploader.upload(imagePath, options);

		return result.url;
	} catch (error) {
		console.error(error);
	}
};
