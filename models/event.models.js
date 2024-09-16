const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/* Creating a new schema for the users model. */
const EventSchema = new Schema({
    id: {
        type: String,
    
    },
    title: {
        type: String,
    },
    description: {
        type: String,

    }, 
    userId: {
        type: String,
    },
    username:{
        type:String,
    },
    timestamp:{
        type:Date,
    },
    date:{
        type:Date,
    },
    signups:{
        type:Number,
    },
    status:{
        type:String
    },
    timezone:{
        type:String
    },
    privacy:{
        type:String
    }
});

module.exports = mongoose.model("events", EventSchema);