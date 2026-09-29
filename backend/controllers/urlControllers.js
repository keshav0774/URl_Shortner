import userModel from '../models/userSchema.js'
import urlModel from '../models/urlSchema.js'
import crypto from "crypto";

const generateShortCode = function(){
    return crypto.randomBytes(4).toString('hex');
}

const isValidHttpUrl = (value) => {
    try {
        const u = new URL(value);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
};

export const generate = async(req,res)=>{
    try {
      
        const {actualurl ,customurl } = req.body;
        const actualUrl = actualurl?.trim();

        if (!actualUrl || !isValidHttpUrl(actualUrl)) {
            return res.status(400).json({ message: "Valid http/https URL do" });
        }
        let shortCode; 
        if(req.user.plan === 'premium' && customurl){
            shortCode = customurl;
             try {
                const url = await urlModel.create({
                    userId: req.user._id,
                    actualUrl,
                    shortCode: customurl,
                });
                return res.status(201).json({ message: "Url is created", url });
            } catch (err) {
                if (err.code === 11000) {
                    return res.status(409).json({ message: "Ye custom code already le liya gaya hai" });
                }
                throw err;
            }
        
        }
       for (let attempt = 0; attempt < 5; attempt++) {
            try {
                const url = await urlModel.create({
                    userId: req.user._id,
                    actualUrl,
                    shortCode: generateShortCode(),
                });
                return res.status(201).json({ message: "Url is created", url });
            } catch (err) {
                if (err.code === 11000) continue;
                throw err;
            }
        }
        return res.status(500).json({ message: "Short code generate nahi ho paya, dobara try karo" });
    } catch (error) {
        console.log("Error from newUrl", error.message);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const redirectUrl = async(req,res)=>{
    try {
        const {shortCode} = req.params; 

        const url = await urlModel.findOne({shortCode});

        if(!url) return res.status(404).json({
            message : "Invalid Short Code"
        });
        await urlModel.updateOne(
         { _id: url._id },
         { $inc: { totalClick: 1 } }
        );
        return res.redirect(url.actualUrl);

    } catch (error) {
        console.log("Error from actual", error.message)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}


export const deleteUrl = async(req,res)=>{
    try {
        const { id } = req.params; 
        const deletedUrl = await urlModel.findOneAndDelete({_id : req.params.id,
            userId : req.user._id
        });
        if (!deletedUrl) {
            return res.status(404).json({
               message: "URL not found"
            });
        }
        await userModel.findByIdAndUpdate(
         req.user._id,
        {
           $pull: { urls: deletedUrl._id }
        }
    );
        return res.status(200).json({
            message : "Your url is deleted"
        })
    } catch (error) {
        console.log("Error from deleteUrl", error.message)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}
