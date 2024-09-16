const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/* Creating a new schema for the users model. */
const UserSchema = new Schema({
    id: {
        type: String,
    
    },
    name: {
        type: String,

    },
    image: {
        type: String,

    }, 
    limit: {
        type: Number,

    }

});

module.exports = mongoose.model("User", UserSchema);