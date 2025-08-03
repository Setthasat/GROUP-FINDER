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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAPI = void 0;
const post_model_1 = require("../models/post.model");
const user_model_1 = require("../models/user.model");
//create post x
//delete post x
//update post  
//get post / posts  x
//inbox - [send, delete] (notification) x
//delete post when date > 3days   x
//delete post when full and time > 1hr  x
class postAPI {
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new BaseResponse();
            const { userID, postID, title, description, tags, partySize, joined, createdAt } = req.body;
            // partySize is a number in the request
            if (!userID || !postID || !title || !description || !tags || !partySize || !joined || !createdAt) {
                baseResponseInst.setValue(400, "data require", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            const user = yield user_model_1.User.findOne({ userID });
            if (!user) {
                baseResponseInst.setValue(404, "User not found", null);
                return res.status(404).json(baseResponseInst.buildResponse());
            }
            // Find usernames for all joined userIDs
            const joinedUsers = yield user_model_1.User.find({ userID: { $in: joined } }).select("userID username");
            const joinedWithUsernames = joinedUsers.map(u => ({
                userID: u.userID,
                username: u.username
            }));
            const createdBy = user.username;
            try {
                const newPOST = yield post_model_1.Post.create({
                    postID,
                    title,
                    description,
                    tags,
                    createdBy,
                    createdAt,
                    partySize: { max: partySize, current: joinedWithUsernames.length },
                    joined: joinedWithUsernames
                });
                if (!newPOST) {
                    baseResponseInst.setValue(404, "Post not created", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                baseResponseInst.setValue(201, "created", newPOST);
                return res.status(201).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Error :", error);
                baseResponseInst.setValue(500, "Internal server error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new BaseResponse();
            const { postID } = req.body;
            if (!postID) {
                baseResponseInst.setValue(400, "postID is required", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            try {
                const post = yield post_model_1.Post.findOne({ postID });
                if (!post) {
                    baseResponseInst.setValue(404, "Post not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                baseResponseInst.setValue(200, "Post found", post);
                return res.status(200).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Error getting post by ID:", error);
                baseResponseInst.setValue(500, "Internal server error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
    }
    getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new BaseResponse();
            try {
                const posts = yield post_model_1.Post.find({});
                baseResponseInst.setValue(200, "Posts fetched", posts);
                return res.status(200).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Error getting all posts:", error);
                baseResponseInst.setValue(500, "Internal server error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
    }
    sendInbox(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new BaseResponse();
            const { userID, title_inbox, description_inbox } = req.body;
            if (!userID || !title_inbox || !description_inbox) {
                baseResponseInst.setValue(400, "userID, title_inbox, and description_inbox are required", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            try {
                const user = yield user_model_1.User.findOneAndUpdate({ userID }, { $push: { inbox: { title_inbox, description_inbox } } }, { new: true });
                if (!user) {
                    baseResponseInst.setValue(404, "User not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                baseResponseInst.setValue(200, "Inbox message sent", user.inbox);
                return res.status(200).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Error sending inbox message:", error);
                baseResponseInst.setValue(500, "Internal server error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new BaseResponse();
            const { postID, userID } = req.body;
            if (!postID || !userID) {
                baseResponseInst.setValue(400, "postID and userID are required", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            try {
                const post = yield post_model_1.Post.findOne({ postID });
                if (!post) {
                    baseResponseInst.setValue(404, "Post not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                const createdBy = yield user_model_1.User.findOne({ userID }).select("username");
                if (!createdBy) {
                    baseResponseInst.setValue(404, "User not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                if (post.createdBy !== createdBy.username) {
                    baseResponseInst.setValue(403, "You are not authorized to delete this post", null);
                    return res.status(403).json(baseResponseInst.buildResponse());
                }
                // if (post.createdBy !== userID) {
                //     baseResponseInst.setValue(403, "You are not authorized to delete this post", null);
                //     return res.status(403).json(baseResponseInst.buildResponse());
                // }
                yield post_model_1.Post.deleteOne({ postID });
                baseResponseInst.setValue(200, "Post deleted successfully", null);
                return res.status(200).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Error deleting post:", error);
                baseResponseInst.setValue(500, "Internal server error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
    }
    joinParty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new BaseResponse();
            const { postID, userID } = req.body;
            if (!postID || !userID) {
                baseResponseInst.setValue(400, "postID and userID are required", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            try {
                const post = yield post_model_1.Post.findOne({
                    postID,
                    expiresAt: { $gt: new Date() },
                    status: 'active'
                });
                if (!post) {
                    baseResponseInst.setValue(404, "Post not found or expired", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                if (post.joined.some((u) => u.userID === userID)) {
                    baseResponseInst.setValue(409, "User already joined this party", null);
                    return res.status(409).json(baseResponseInst.buildResponse());
                }
                if (post.joined.length >= post.partySize.max) {
                    baseResponseInst.setValue(409, "Party is already full", null);
                    return res.status(409).json(baseResponseInst.buildResponse());
                }
                const user = yield user_model_1.User.findOne({ userID }).select("userID username");
                if (!user) {
                    baseResponseInst.setValue(404, "User not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                post.joined.push(user.userID);
                post.partySize.current = post.joined.length;
                const isPartyFull = post.joined.length >= post.partySize.max;
                if (isPartyFull && !post.partySizeFullAt) {
                    post.status = 'party_full';
                    post.partySizeFullAt = new Date();
                    post.partyFullExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
                }
                const updatedPost = yield post.save();
                let message = "Joined party successfully";
                let additionalInfo = {};
                if (isPartyFull) {
                    message = "Joined party successfully! Party is now full and will expire in 1 hour.";
                    additionalInfo = {
                        partyFull: true,
                        expiresInHours: 1,
                        partyFullExpiresAt: post.partyFullExpiresAt
                    };
                }
                baseResponseInst.setValue(200, message, Object.assign(Object.assign({}, updatedPost.toObject()), additionalInfo));
                return res.status(200).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Error joining party:", error);
                baseResponseInst.setValue(500, "Internal server error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
    }
    leaveParty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new BaseResponse();
            const { postID, userID } = req.body;
            if (!postID || !userID) {
                baseResponseInst.setValue(400, "postID and userID are required", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            try {
                const post = yield post_model_1.Post.findOne({ postID });
                if (!post) {
                    baseResponseInst.setValue(404, "Post not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                const userIndex = post.joined.indexOf(userID);
                if (userIndex === -1) {
                    baseResponseInst.setValue(409, "User is not a member of this party", null);
                    return res.status(409).json(baseResponseInst.buildResponse());
                }
                post.joined.splice(userIndex, 1);
                post.partySize.current = post.joined.length;
                const updatedPost = yield post.save();
                baseResponseInst.setValue(200, "Left party successfully", updatedPost);
                return res.status(200).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Error leaving party:", error);
                baseResponseInst.setValue(500, "Internal server error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
    }
}
exports.postAPI = postAPI;
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
