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
    tags: [{
            type: String,
            required: true
        }],
    createdBy: {
        type: String,
        required: true
    },
    partySize: {
        current: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            required: true
        }
    },
    joined: [{
            type: String,
            required: true
        }],
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    expiresAt: {
        type: Date,
        default: function () {
            return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        }
    },
    partyFullExpiresAt: {
        type: Date,
        default: null
    },
    partySizeFullAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'party_full'],
        default: 'active'
    }
}, {
    timestamps: true
});
//for faster queries?
PostSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
PostSchema.index({ partyFullExpiresAt: 1 }, { expireAfterSeconds: 0 });
PostSchema.index({ postID: 1 });
PostSchema.index({ status: 1 });
PostSchema.index({ createdAt: -1 });
exports.Post = (0, mongoose_1.model)('Post', PostSchema);
