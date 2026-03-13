const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
  
  Teamname: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  TeamMembers: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    }
  }],

  password: {
    type: String,
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Participant", ParticipantSchema);