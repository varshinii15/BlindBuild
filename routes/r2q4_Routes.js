const express = require("express");
const router = express.Router();
const checkinController = require("../controllers/r2q4_controller");
const appController = require("../controllers/r2q1_controller");


// Organisor (Convenor) Routes
router.post("/events", appController.createEvent);
router.post("/verify-ticket", checkinController.verifyTicket);
router.post("/attendance-mark", checkinController.markAttendance);
router.post("/attendance-undo", checkinController.undoAttendance);
router.get("/attendance", checkinController.getAttendanceStatus);
router.get("/participant", checkinController.getParticipant);
router.get("/badge", checkinController.generateBadge);
router.get("/teams", checkinController.getTeams);

// Winner Management
router.post("/winner", checkinController.addWinner);
router.put("/winner/:id", checkinController.updateWinner);
router.delete("/winner/:id", checkinController.deleteWinner);
router.get("/winners/event/:eventId", checkinController.getWinnersByEvent);

module.exports = router;
