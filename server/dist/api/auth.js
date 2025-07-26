"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAPI = void 0;
const user_1 = require("../models/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const auth_utils_1 = require("../utils/auth.utils");
class UserAPI {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const baseResponseInst = new BaseResponse();
            const { email, username, password, bio } = req.body;
            console.log(email, username, password, bio);
            const files = req.files;
            const profileImage = (_a = files === null || files === void 0 ? void 0 : files.profileImage) === null || _a === void 0 ? void 0 : _a[0];
            const backgroundImage = (_b = files === null || files === void 0 ? void 0 : files.backgroundImage) === null || _b === void 0 ? void 0 : _b[0];
            if (!profileImage || !backgroundImage) {
                baseResponseInst.setValue(400, "Missing profile or background image", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            if (!(0, auth_utils_1.isValidEmail)(email, 1, 100) || !(0, auth_utils_1.isValidString)(username, 1, 100) || !(0, auth_utils_1.isValidString)(password, 1, 100)) {
                baseResponseInst.setValue(400, "Invalid input", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            const existingUser = yield user_1.User.findOne({ email });
            if (existingUser) {
                baseResponseInst.setValue(400, "Email already registered", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            try {
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                const newUser = yield user_1.User.create({
                    userID: (0, uuid_1.v4)(),
                    email,
                    username,
                    password: hashedPassword,
                    bio,
                    profileImageURL: profileImage.path,
                    backgroundImageURL: backgroundImage.path,
                    inbox: [],
                });
                baseResponseInst.setValue(201, "User registered successfully", newUser);
                return res.status(201).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Register error:", error);
                baseResponseInst.setValue(500, "Internal server error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new BaseResponse();
            const { email, password } = req.body;
            if (!(0, auth_utils_1.isValidString)(email, 1, 100) || !(0, auth_utils_1.isValidString)(password, 1, 100)) {
                baseResponseInst.setValue(400, "Invalid input ", null);
                const responseData = baseResponseInst.buildResponse();
                return res.status(400).json(responseData);
            }
            const user = yield user_1.User.findOne({ email });
            if (!user) {
                baseResponseInst.setValue(400, "User not found", null);
                const responseData = baseResponseInst.buildResponse();
                return res.status(400).json(responseData);
            }
            const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordMatch) {
                baseResponseInst.setValue(400, "Password is incorrect", null);
                const responseData = baseResponseInst.buildResponse();
                return res.status(400).json(responseData);
            }
            baseResponseInst.setValue(200, "Login successful", {
                userId: user.userID,
                username: user.username,
                email: user.email
            });
            const responseData = baseResponseInst.buildResponse();
            return res.status(200).json(responseData);
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new BaseResponse();
            try {
                const users = yield user_1.User.find({}, {
                    password: 0,
                    verificationToken: 0
                });
                if (!users || users.length === 0) {
                    baseResponseInst.setValue(404, "No users found", []);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                baseResponseInst.setValue(200, "successfully", users);
                return res.status(200).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Error :", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new BaseResponse();
            const { userID } = req.body;
            if (!userID) {
                baseResponseInst.setValue(400, "User ID is required", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            try {
                const user = yield user_1.User.findOne({ userID }, {
                    password: 0,
                    verificationToken: 0
                });
                if (!user) {
                    baseResponseInst.setValue(404, "User not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                baseResponseInst.setValue(200, "success", user);
                return res.status(200).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Error :", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
    }
}
exports.UserAPI = UserAPI;
class BaseResponse {
    constructor(code = 200, description = "", data = null) {
        this.code = code;
        this.description = description;
        this.data = data;
    }
    buildResponse() {
        return {
            status: { code: this.code, description: this.description },
            data: this.data,
        };
    }
    setValue(code, description, data) {
        this.code = code;
        this.description = description;
        this.data = data;
    }
}
