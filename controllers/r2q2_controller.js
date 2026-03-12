const { Workshop, Slot, Booking } = require("../models/r2q2_workshop");

// GET /workshops
const getWorkshops = async (req, res) => {
  const workshops = await Workshop.find().populate("slots");
  res.json({ status: "success", workshops });
};

// GET /workshops/:id
const getWorkshopById = async (req, res) => {
  const workshop = await Workshop.findById(req.params.id).populate("slots");
  if (!workshop) return res.status(404).json({ status: "error", msg: "Workshop not found" });
  res.json({ status: "success", workshop });
};

// GET /workshops/:id/slots
const getWorkshopSlots = async (req, res) => {
  const slots = await Slot.find({ workshopId: req.params.id });
  res.json({ status: "success", slots });
};

// POST /book-slot
const bookSlot = async (req, res) => {
  const { workshopId, slotId, userId } = req.body;

  const slot = await Slot.findById(slotId);
  if (!slot || !slot.available) {
    return res.status(400).json({ status: "error", msg: "Slot not available" });
  }

  slot.available = false;
  await slot.save();

  const booking = new Booking({ workshopId, slotId, userId });
  await booking.save();

  res.json({ status: "success", msg: "Slot booked successfully", bookingId: booking._id });
};

// DELETE /cancel-slot
const cancelSlot = async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).json({ status: "error", msg: "Booking not found" });

  booking.status = "cancelled";
  await booking.save();

  await Slot.findByIdAndUpdate(booking.slotId, { available: true });

  res.json({ status: "success", msg: "Booking cancelled" });
};

// GET /booking-status?userId=U123
const getBookingStatus = async (req, res) => {
  const { userId } = req.query;
  const bookings = await Booking.find({ userId }).populate("workshopId slotId");
  res.json({ status: "success", bookings });
};

module.exports = {
  getWorkshops,
  getWorkshopById,
  getWorkshopSlots,
  bookSlot,
  cancelSlot,
  getBookingStatus
};