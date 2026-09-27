import mongoose  from "mongoose";

const connectToMongoDb = async ()=>{

    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB is connect successfully");
}

export default connectToMongoDb;