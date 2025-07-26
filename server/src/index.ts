import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { UserAPI } from './api/auth';
import { User } from './models/user';

dotenv.config();

const app = express();
// const PORT = process.env.PORT;
const PORT = process.env.PORT || 8888;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


const userINST = new UserAPI();


if (process.env.DB_URL) {
    try {
        mongoose.connect(process.env.DB_URL);
        console.log('DB Connected...');
    } catch (error) {
        console.log(error);
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    }
  });

//AUTH 

// ??? .bind = point a data in class ??? 
app.post('/api/user/register', upload.fields([{ name: "profileImage", maxCount: 1 },{ name: "backgroundImage", maxCount: 1 }]), userINST.register.bind(userINST))
app.get('/api/user/getAllUsers', userINST.getAllUsers)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
