import userModel from '../models/userSchema.js'
import urlModel from '../models/urlSchema.js'
import crypto from "crypto";

const generateShortCode = function(){
    return crypto.randomBytes(4).toString('hex');
}

export const newUrl = async(req,res)=>{
    try {
        const user = await userModel.findById(req.user._id);
        const {actualurl ,customurl } = req.body;

        let shortCode; 
        if(user.plan === 'premium' && customurl){
            shortCode = customurl;
            const url = await urlModel.create({
                userId : req.user._id,
                actualUrl : actualurl, 
                shortCode : shortCode
            }); 

            return res.status(200).json({
                message : "Url is created", 
                url : url
            })
        }
        else {
            shortCode = generateShortCode(); 
            const url = await urlModel.create({actualUrl : actualurl, shortCode : shortCode, userId : req.user._id})
            return res.status(200).json({
                message : "Url is created", 
                url : url
            })
        }
    } catch (error) {
        console.log("Error from newUrl", error.message);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const actualurl = async(req,res)=>{
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

export const totalUrl = async(req,res)=>{
    try {
        const urls = await userModel.findById({_id : req.user._id}).populate('urls');

        return res.status(200).json({
            message : "Here is the url",
            urls : urls.urls
        })
    } catch (error) {
        console.log("Error from totalUrl", error.message);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const updateUrl = async(req,res)=>{
    try {
        
    } catch (error) {
        console.log("Error from updateUrl", error.message);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const deleteUrl = async(req,res)=>{
    try {
        const {shortCode} = req.params; 
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

export const currentUrl = async (req, res) => {
    try {
        const url = await urlModel.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!url) {
            return res.status(404).json({
                message: "URL not found"
            });
        }

        return res.status(200).json({ url });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


