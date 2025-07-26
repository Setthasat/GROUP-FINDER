import { Schema, model } from 'mongoose';

interface inboxInterface {
    title_inbox: string;
    description_inbox: string;
}

interface UserInterface {
    userID: string;
    username: string;
    email: string;
    password: string;
    inbox: inboxInterface[];
    profileImageURL: string;
    backgroundImageURL: string;
    bio: string;
}

const UserSchema = new Schema<UserInterface>({
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
    profileImageURL:  {
        type : String,
        unique : true
    },
    backgroundImageURL: { 
        type : String,
        unique : true
    },
    bio: { 
        type : String,
    }
});

export const User = model<UserInterface>('User', UserSchema);