const express = require("express");
const router = express.Router();
const appController = require("../controllers/r2q1_controller");
const checkinController = require("../controllers/r2q4_controller");


// Participant Routes
router.post("/teams", appController.createParticipant);
router.get("/events", appController.getEvents);
router.post("/register", appController.registerEvent);
router.get("/registration-status/:id", appController.getRegistrationStatus);
router.delete("/cancel-registration/:id", appController.cancelRegistration);
router.post("/ticket", appController.generateTicket);
router.get("/ticket/:id", appController.getTicketDetails);
router.get("/checkin-ticket/:id", checkinController.getTicketDetails);

module.exports = router;
