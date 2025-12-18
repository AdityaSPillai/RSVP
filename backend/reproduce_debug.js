
import mongoose from "mongoose";
import EventModel from "./schema/eventSchema.js";
import UserModel from "./schema/userSchema.js";

const MONGO_URL = "mongodb+srv://adityaspillai17_db_user:Aditya%401@cluster0.7pgj77v.mongodb.net/?appName=Cluster0";

const run = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");

        console.log("Running query...");
        const events = await EventModel.find({})
            .populate('host', 'name email')
            .populate('attendees', 'name')
            .sort({ createdAt: -1 });

        console.log("Query successful. Events count:", events.length);
    } catch (error) {
        console.error("Caught error:");
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
