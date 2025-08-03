import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { UserAPI } from './api/auth';
import { postAPI } from './api/post';
import { get } from 'http';

dotenv.config();

const app = express();
// const PORT = process.env.PORT;
const PORT = process.env.PORT || 8888;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));




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

const userINST = new UserAPI();
const postINST = new postAPI();

//AUTH 
app.put('/api/user/update-image', upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "backgroundImage", maxCount: 1 }]), userINST.updateImage);
app.post('/api/user/register', upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "backgroundImage", maxCount: 1 }]), userINST.register);
app.get('/api/user/getAllUsers', userINST.getAllUsers);
app.get('/api/user/login', userINST.login);

//POST
app.get('/api/post/getAllPosts', postINST.getAllPosts);
app.post('/api/post/getPost/:postID', postINST.getPostById);
app.post('/api/post/create/post', postINST.createPost);
app.delete('/api/post/delete/post/:postID', postINST.deletePost);
app.post('/api/post/join/post', postINST.joinParty);
app.post('/api/post/leave/post', postINST.leaveParty);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
