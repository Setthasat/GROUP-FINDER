import { Schema, model } from 'mongoose';


interface postInterface {
    postID: string;
    title: string;
    description: string;
    nation: string;
    tags: string[];
    createdBy: string;
    partySize: number;
    joined: string[];
    createdAt : Date
}

const PostSchema = new Schema<postInterface>({
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
    createdAt : {
        type: Date,
        require : true
    }
});

export const Post = model<postInterface>('Post', PostSchema);

