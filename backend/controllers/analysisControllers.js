import analysisModel from '../models/analysisSchema.js';
import urlModel from '../models/urlSchema.js';
import userModel from '../models/userSchema.js';


export const analysis = async(req,res)=>{
    try {
        const {_id} = req.user;
  
        const urls = await urlModel.find({
            userId : _id
        });

        if(!urls){
        return res.status(401).json({
            message : "Urls not found"
        });
        

       }
       return res.status(200).json({
            message : "here is you're urls",
            urls : urls
        })
    } catch (error) {
        console.log("Error from analysis", error.message);
        return res.status(500).json({
            message : error.message
        })
    }
}


export const urlAnalysis = async(req,res)=>{
    try {
        const {id} = req.params;

        if(!id) return res.status(400).json({message : "ID not fond"});

        const url = await urlModel.findOne({_id : id, userId : req.user._id});
        
        const analytics = await analysisModel
            .find({
                urlId: id
            })
            .sort({ date: 1 });
        res.status(200).json({
            mesage : "here is your analysis",
            url : url,
            analytics: analytics
        })
    } catch (error) {
        console.log("Error from url analysis", error.message);
        return res.status(500).json({
            message : error.message
        })
    }
}