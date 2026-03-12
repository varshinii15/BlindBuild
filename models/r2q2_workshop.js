const mongoose = require("mongoose");

// Workshop Schema
const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  slots: [{ type: mongoose.Schema.Types.ObjectId, ref: "Slot" }]
});

const Workshop = mongoose.model("Workshop", workshopSchema);

// Slot Schema
const slotSchema = new mongoose.Schema({
  workshopId: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", required: true },
  time: { type: String, required: true },
  available: { type: Boolean, default: true }
});

const Slot = mongoose.model("Slot", slotSchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  workshopId: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },
  status: { type: String, enum: ["booked", "cancelled"], default: "booked" }
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = { Workshop, Slot, Booking };