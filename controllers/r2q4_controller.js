const Participant = require("../models/r2q4_participant");
const Ticket = require("../models/r2q4_ticket");
const Attendance = require("../models/r2q4_attendance");
const Badge = require("../models/r2q4_badge");
const Winner = require("../models/r2q4_winner");

// ---------------- TICKETS ----------------

// Get Ticket Details
exports.getTicketDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Ticket.findOne({ ticketId: id }).populate("participantId");

        if (!ticket) return res.status(404).json({ message: "Ticket not found" });
        res.json(ticket);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Verify Ticket
exports.verifyTicket = async (req, res) => {
    try {
        const { ticketId } = req.body;
        const ticket = await Ticket.findOne({ ticketId });

        if (!ticket) return res.status(404).json({ valid: false, message: "Ticket not found" });
        if (!ticket.isValid) return res.status(400).json({ valid: false, message: "Ticket already used" });

        res.json({ valid: true, ticket });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ---------------- CHECK-IN & ATTENDANCE ----------------

// Process Mark Attendance
exports.markAttendance = async (req, res) => {
    try {
        const { ticketId } = req.body;
        const ticket = await Ticket.findOne({ ticketId });

        if (!ticket) return res.status(404).json({ message: "Ticket not found" });

        // Check if already in attendance
        const alreadyCheckedIn = await Attendance.findOne({ ticketId });
        if (alreadyCheckedIn) return res.status(400).json({ message: "Already checked in" });

        const attendance = new Attendance({
            ticketId: ticket.ticketId,
            participantId: ticket.participantId
        });
        await attendance.save();

        // Void ticket
        ticket.isValid = false;
        ticket.status = "Used";
        await ticket.save();

        const participant = await Participant.findById(ticket.participantId);
        res.status(201).json({ message: "Attendance marked successfully", participant });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Attendance Status (List all)
exports.getAttendanceStatus = async (req, res) => {
    try {
        const list = await Attendance.find().populate("participantId");
        res.json({
            total: list.length,
            attendees: list
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Undo Attendance
exports.undoAttendance = async (req, res) => {
    try {
        const { ticketId } = req.body;
        const ticket = await Ticket.findOne({ ticketId });

        if (!ticket) return res.status(404).json({ message: "Ticket not found" });

        // Remove from attendance
        const attendance = await Attendance.findOneAndDelete({ ticketId });
        if (!attendance) return res.status(400).json({ message: "Attendance record not found" });

        // Reactivate ticket
        ticket.isValid = true;
        ticket.status = "Valid";
        await ticket.save();

        // Remove badge if generated
        await Badge.findOneAndDelete({ ticketId });

        res.json({ message: "Attendance undone successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ---------------- PARTICIPANTS ----------------

// Get Participant Details
exports.getParticipant = async (req, res) => {
    try {
        const { id } = req.query;
        const participant = await Participant.findById(id);

        if (!participant) return res.status(404).json({ message: "Participant not found" });
        res.json(participant);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ---------------- BADGES ----------------

// Generate Badge
exports.generateBadge = async (req, res) => {
    try {
        const { ticketId } = req.query;
        const attendance = await Attendance.findOne({ ticketId });

        if (!attendance) return res.status(400).json({ message: "Participant must mark attendance first" });

        let badge = await Badge.findOne({ ticketId });
        if (!badge) {
            badge = new Badge({
                badgeId: `B-${Date.now()}-${ticketId}`,
                ticketId,
                participantId: attendance.participantId
            });
            await badge.save();
        }

        const participant = await Participant.findById(attendance.participantId);
        res.status(201).json({ message: "Badge generated", badge, participant });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const Participant = require("../models/r2q1_participant");

// Get All Teams
exports.getTeams = async (req, res) => {
    try {
        const teams = await Participant.find();
        res.json(teams);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ---------------- WINNERS ----------------

// Add Winner
exports.addWinner = async (req, res) => {
    try {
        const { eventId, participantId, position, prizeName } = req.body;
        
        // Check if winner position already exists for this event
        const existingWinner = await Winner.findOne({ eventId, position });
        if (existingWinner) return res.status(400).json({ message: `Position ${position} for this event is already assigned.` });

        const winner = new Winner({ eventId, participantId, position, prizeName });
        await winner.save();
        
        res.status(201).json({ message: "Winner added successfully", winner });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update Winner
exports.updateWinner = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const winner = await Winner.findByIdAndUpdate(id, updates, { new: true });
        if (!winner) return res.status(404).json({ message: "Winner record not found" });

        res.json({ message: "Winner updated successfully", winner });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Winner
exports.deleteWinner = async (req, res) => {
    try {
        const { id } = req.params;
        const winner = await Winner.findByIdAndDelete(id);
        
        if (!winner) return res.status(404).json({ message: "Winner record not found" });
        
        res.json({ message: "Winner deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Winners by Event
exports.getWinnersByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const winners = await Winner.find({ eventId })
            .populate("participantId")
            .sort({ position: 1 });
        res.json(winners);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
