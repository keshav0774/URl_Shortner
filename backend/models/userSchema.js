import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    plan: {
            type: String,
            enum: ["free", "premium"],
            default: "free",
    },
    password: {
        type: String,
        required: true
    },

    urls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "url"
    }],

    createdAt: {
        type: Date,
        default: Date.now
    }
},{ timestamps: true });

const userModel = mongoose.model("user", userSchema);

export default userModel;