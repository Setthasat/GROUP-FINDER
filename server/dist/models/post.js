"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    postID: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    nation: {
        type: String,
        required: true
    },
    tags: [{
            type: String,
            required: true
        }],
    createdBy: {
        type: String,
        required: true
    },
    partySize: {
        type: Number,
        required: true
    },
    joined: [{
            type: String,
            required: true
        }],
    createdAt: {
        type: Date,
        require: true
    }
});
exports.Post = (0, mongoose_1.model)('Post', PostSchema);
