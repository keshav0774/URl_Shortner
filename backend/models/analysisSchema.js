import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
    urlId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "url",
        required: true,
        index: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index: true
    },

    date: {
        type: Date,
        required: true
    },

    clicks: {
        type: Number,
        default: 0
    }
});

analysisSchema.index(
    { urlId: 1, date: 1 },
    { unique: true }
);

const analyticsModel = mongoose.model('analysis', analysisSchema);

export default analyticsModel;