const mongoose = require("mongoose");

const WinnerSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "R2Q1_Event",
        required: true
    },
    participantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant",
        required: true
    },
    position: {
        type: Number,
        required: true, // e.g., 1 for First, 2 for Second, etc.
    },
    prizeName: {
        type: String,
        trim: true
    },
    announcedAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure a participant can't be added twice for the same position in the same event
WinnerSchema.index({ eventId: 1, position: 1 }, { unique: true });

module.exports = mongoose.model("R2Q4_Winner", WinnerSchema);
