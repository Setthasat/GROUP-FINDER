"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("./api/auth");
const post_1 = require("./api/post");
dotenv_1.default.config();
const app = (0, express_1.default)();
// const PORT = process.env.PORT;
const PORT = process.env.PORT || 8888;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
if (process.env.DB_URL) {
    try {
        mongoose_1.default.connect(process.env.DB_URL);
        console.log('DB Connected...');
    }
    catch (error) {
        console.log(error);
    }
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    }
});
const userINST = new auth_1.UserAPI();
const postINST = new post_1.postAPI();
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
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
