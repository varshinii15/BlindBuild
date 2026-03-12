const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({

  ParticipantId: {
    type: String,
    required: true,
    ref: "Participant"
  },
  eventId: {
    type: String,
    required: true,
    enum:['Hackathon','Workshop','Seminar'],
    ref: "Event"
  },
  status: {
    type: String,
    enum: ["Registered", "Not Registered"],
    default: " Not Registered"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Registration", RegistrationSchema);