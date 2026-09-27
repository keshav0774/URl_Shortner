import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index: true
    },
    actualUrl : {
        type : String, 
        require : "true"
    },
    shortCode : {
        type : String,
        require : true,
        unique : true,
        index : true,
    },
    totalClick :{
        type : Number, 
        default : 0,
    },
    isActive : {
        type : Boolean,
        default : true,
    },
    plan : {
        type : String,
        default : 'free',
        enum : ['premium', 'free']
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    expiredAt : {
        type : Date,
        default : null,
    }
    
})

const urlModel = mongoose.model('url', urlSchema);

export default urlModel;