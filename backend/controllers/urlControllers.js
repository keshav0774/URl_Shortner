import userModel from '../models/userSchema.js'
import urlModel from '../models/urlSchema.js'
import crypto from "crypto";

const generateShortCode = function(){
    return crypto.randomBytes(4).toString('hex');
}

export const newUrl = async(req,res)=>{
    try {
      
        const {actualurl ,customurl } = req.body;

        let shortCode; 
        if(req.user.plan === 'premium' && customurl){
            shortCode = customurl;
            const url = await urlModel.create({
                userId : req.user._id,
                actualUrl : actualurl, 
                shortCode : shortCode
            }); 
            await userModel.findByIdAndUpdate(
                req.user._id,
                {
                 $push: { urls: url._id }
                }
            );
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


export const updateUrl = async (req, res) => {
    try {
        const { actualUrl, customurl, expiredAt, isActive } = req.body;

        const updateFields = {};

        // Actual URL update
        if (actualUrl !== undefined) {
            updateFields.actualUrl = actualUrl;
        }

        // Expiry update
        if (expiredAt !== undefined) {
            updateFields.expiredAt = expiredAt;
        }

        // Enable / Disable URL
        if (isActive !== undefined) {
            updateFields.isActive = isActive;
        }

        // Custom alias only for premium users
        if (customurl !== undefined) {

            if (req.user.plan !== "premium") {
                return res.status(403).json({
                    message: "Custom URL is available for premium users only"
                });
            }

            updateFields.shortCode = customurl;
        }

        const updatedUrl = await urlModel.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user._id
            },
            {
                $set: updateFields
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedUrl) {
            return res.status(404).json({
                message: "URL not found"
            });
        }

        return res.status(200).json({
            message: "URL updated successfully",
            url: updatedUrl
        });

    } catch (error) {

        // custom alias already exists
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Custom URL already exists"
            });
        }

        console.log("Error from updateUrl:", error.message);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};