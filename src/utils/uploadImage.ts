import { v2 } from "cloudinary";

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: any) => {
  const img = await v2.uploader.upload(
    file.tempFilePath,
    { folder: "buycar" },
    (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }
      return result;
    }
  );
  return img;
};
