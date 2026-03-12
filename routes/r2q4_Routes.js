const express = require("express");
const router = express.Router();
const checkinController = require("../controllers/r2q4_controller");

// Tickets
router.get("/ticket/:id", checkinController.getTicketDetails);
router.post("/verify-ticket", checkinController.verifyTicket);

// Attendance
router.post("/attendance-mark", checkinController.markAttendance);
router.post("/attendance-undo", checkinController.undoAttendance);
router.get("/attendance", checkinController.getAttendanceStatus);

// Participant
router.get("/participant", checkinController.getParticipant);

// Badge
router.get("/badge", checkinController.generateBadge);

module.exports = router;
