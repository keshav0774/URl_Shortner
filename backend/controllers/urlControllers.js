import userModel from '../models/userSchema.js'
import urlModel from '../models/urlSchema.js'
import crypto from "crypto";

const generateShortCode = function(){
    return crypto.randomBytes('4').toString('hex');
}

const newUrl = async(req,res)=>{
    try {
        if(req.body.plan === 'premium'){
            
        }
    } catch (error) {
        
    }
}

