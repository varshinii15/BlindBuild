const express = require("express");
const {
  getWorkshops,
  getWorkshopById,
  getWorkshopSlots,
  bookSlot,
  cancelSlot,
  getBookingStatus
} = require("../controllers/r2q2_controller");

const router = express.Router();

router.get("/workshops", getWorkshops);
router.get("/workshops/:id", getWorkshopById);
router.get("/workshops/:id/slots", getWorkshopSlots);
router.post("/book-slot", bookSlot);
router.delete("/cancel-slot", cancelSlot);
router.get("/booking-status", getBookingStatus);

module.exports = router;
