import { Schema, model } from 'mongoose';


interface postInterface {
    postID: string;
    title: string;
    description: string;
    nation: string;
    tags: string[];
    createdBy: string;
    partySize: { current: number, max: number; };
    joined: string[];
    createdAt: Date;
    expiresAt: Date;
    partyFullExpiresAt: Date | null;
    partySizeFullAt: Date | null;
    status: 'active' | 'party_full';
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

export const Post = model<postInterface>('Post', PostSchema);

