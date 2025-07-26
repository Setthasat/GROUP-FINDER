"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    inbox: [{
            title_inbox: {
                type: String,
                required: true,
            },
            description_inbox: {
                type: String,
                required: true,
            }
        }],
    profileImageURL: {
        type: String,
        unique: true
    },
    backgroundImageURL: {
        type: String,
        unique: true
    },
    bio: {
        type: String,
    }
});
exports.User = (0, mongoose_1.model)('User', UserSchema);
