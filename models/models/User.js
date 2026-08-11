const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    mobile: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },

    email: {
        type: String,
        required: true,
        match: /^\S+@\S+\.\S+$/
    },

    address: {
        street: String,
        city: String,
        state: String,
        country: String
    },

    loginId: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9]{8}$/
    },

    password: {
        type: String,
        required: true,
        match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/
    },

    creationTime: {
        type: Date,
        default: Date.now
    },

    lastUpdatedOn: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("User", userSchema);