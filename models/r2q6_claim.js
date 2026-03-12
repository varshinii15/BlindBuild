const mongoose = require("mongoose");

const ClaimSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "R2Q6_Item",
        required: true
    },
    claimantName: {
        type: String,
        required: true
    },
    claimantContact: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Cancelled"],
        default: "Pending"
    },
    adminRemarks: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("R2Q6_Claim", ClaimSchema);
