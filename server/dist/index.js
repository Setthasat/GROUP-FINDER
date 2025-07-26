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
dotenv_1.default.config();
const app = (0, express_1.default)();
// const PORT = process.env.PORT;
const PORT = process.env.PORT || 8888;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
const userINST = new auth_1.UserAPI();
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
//AUTH 
// ??? .bind = point a data in class ??? 
app.post('/api/user/register', upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "backgroundImage", maxCount: 1 }]), userINST.register.bind(userINST));
app.get('/api/user/getAllUsers', userINST.getAllUsers);
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
