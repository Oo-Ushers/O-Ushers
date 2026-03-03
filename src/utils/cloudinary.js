import path from 'path'
import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config({path:path.resolve('./config/.env')})

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

export const uploadImageToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(file.path, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
  };
export default cloudinary