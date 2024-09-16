const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/* Creating a new schema for the users model. */
const EventSchema = new Schema({
    id: {
        type: String,
    
    },
    name: {
        type: String,

    },
    email: {
        type: String,

    }, 
    eventId: {
        type: String,

    },
    date:{
        type:Date,
    }

});

module.exports = mongoose.model("people", EventSchema);