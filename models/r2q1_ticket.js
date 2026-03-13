const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  ticketCode: {
    type: String,
    unique: true
  },
  registrationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Registration"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Participant"
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Event"
  },
  qrCode: {
    type: String,
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["Valid", "Invalid"],
    default: "Invalid"
  }
});

module.exports = mongoose.model("Ticket", TicketSchema);