import multer from 'multer';
import cloudinary from 'cloudinary';
import { v2 as cloudinaryV2 } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Konfigurasi Cloudinary
cloudinaryV2.config({
  cloud_name: process.env.CLOUD_NAME, // Ganti dengan nama cloud kamu
  api_key: process.env.CLOUD_API_KEY, // Ganti dengan API key kamu
  api_secret: process.env.CLOUD_API_SECRET, // Ganti dengan API secret kamu
});

// Konfigurasi penyimpanan menggunakan Multer (diskStorage sementara untuk proses upload)
const storage = multer.memoryStorage(); // Menyimpan file dalam memory sementara

const upload = multer({ storage: storage }); // Gunakan penyimpanan memory

// Middleware upload dan kirim ke Cloudinary
const uploadToCloudinary = (req, res, next) => {
  // Mengecek apakah file ada di req.file
  if (!req.file) {
    console.log("No file uploaded");
    return next();
  }

  console.log("File uploaded:", req.file.originalname); // Logging nama file yang di-upload

  // Upload ke Cloudinary menggunakan upload_stream
  cloudinaryV2.uploader.upload_stream(
    {
      folder: 'uploads/', // Folder Cloudinary tempat gambar disimpan
      resource_type: 'image', // Pastikan itu adalah image
    },
    (error, result) => {
      if (error) {
        console.error("Error uploading to Cloudinary:", error); // Logging error
        return res.status(500).send('Error uploading to Cloudinary');
      }

      console.log("Cloudinary upload result:", result); // Logging hasil upload dari Cloudinary

      // Simpan URL gambar ke dalam req.file
      req.file.cloudinaryUrl = result.secure_url; 

      // Pastikan URL berhasil disimpan
      console.log("Cloudinary URL:", req.file.cloudinaryUrl); // Logging URL gambar

      next(); // Lanjutkan ke controller
    }
  ).end(req.file.buffer); // Kirimkan buffer file ke Cloudinary
};

export { upload, uploadToCloudinary };
