const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    refId: {
        type: String,
        unique: true
    },
    type: {
        type: String,
        enum: ["Lost", "Found"],
        required: true
    },
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    reporterName: {
        type: String,
        required: true
    },
    reporterContact: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Open", "Matched", "Claimed", "Returned", "Cancelled"],
        default: "Open"
    },
    matchedWith: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "R2Q6_Item"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("R2Q6_Item", ItemSchema);
