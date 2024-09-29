import fs from 'fs';
import multer from 'multer';
import path from 'path';

//set base directory for the uploads to be stored
const dir = './uploads';

//create uploads directory if it dosen't exist
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// create subfolders for avatars and post images if they don't exist
const avatarDir = path.join(dir, 'avatar');
const postImageDir = path.join(dir, 'postImage');

if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
}

if (!fs.existsSync(postImageDir)) {
    fs.mkdirSync(postImageDir, { recursive: true });
}

// configure storage with filename and location
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //determine the destination folder based on the type of upload
        if (file.fieldname === 'avatar') {
            cb(null, avatarDir);
        }
        else if (file.fieldname === 'image') {
            cb(null, postImageDir);
        }
        else {
            cb(new Error('Invalid field name'));
        }
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
        cb(null, `${timestamp} - ${file.originalname}`);
    }
});

//using multer to upload the file and pass the storage
export const upload = multer({ storage: storage, limits: { fileSize: 100 * 1024 * 1024 } });