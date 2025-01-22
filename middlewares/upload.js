import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/')
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const uniqueName = `${timestamp}-${file.fieldname}${ext}`;
        cb(null, uniqueName)
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('invalid file type'))
    }
}

const upload = multer({
    storage,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter,
});

export default upload;
