const Participant = require("../models/r2q1_participant");
const Event = require("../models/r2q1_events");
const Registration = require("../models/r2q1_registration");
const Ticket = require("../models/r2q1_ticket");
const bcrypt = require("bcryptjs");
const QRCode = require("qrcode");

// ---------------- PARTICIPANTS ----------------

// Create Team/Participant
exports.createParticipant = async (req, res) => {
  try {
    const { Teamname, TeamMembers, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const participant = new Participant({
      Teamname,
      TeamMembers,
      password: hashedPassword
    });

    await participant.save();
    res.status(201).json({ message: "Team created successfully", participant });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Team name already exists. Choose another name." });
    }
    res.status(400).json({ error: error.message });
  }
};

// ---------------- EVENTS ----------------

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    const formattedEvents = events.map(event => ({
      id: event._id,
      name: event.title,
      description: event.description,
      location: event.location,
      date: event.date,
      "maximum limit": event.capacity
    }));
    res.json(formattedEvents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ---------------- REGISTRATION ----------------

// Register Participant for Event
exports.registerEvent = async (req, res) => {
  try {
    const { Teamname, eventId } = req.body;

    const participant = await Participant.findOne({ Teamname });
    if (!participant) return res.status(404).json({ error: "Team not found" });

    const registration = new Registration({
      ParticipantId: participant._id,
      eventId,
      status: "Registered"
    });

    await registration.save();
    res.status(201).json({ message: "Registered successfully", registration });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Registration Status
exports.getRegistrationStatus = async (req, res) => {
  try {
    const { teamName } = req.params;
    const participant = await Participant.findOne({ Teamname: teamName });
    if (!participant) return res.status(404).json({ message: "Team not found" });

    const registrations = await Registration.find({ ParticipantId: participant._id }).populate("eventId");

    // Fetch tickets for these registrations to show in the UI
    const registrationsWithTickets = await Promise.all(registrations.map(async (reg) => {
      const ticket = await Ticket.findOne({ registrationId: reg._id });
      return {
        ...reg.toObject(),
        ticketCode: ticket ? ticket.ticketCode : null
      };
    }));

    if (registrations.length === 0) return res.status(404).json({ message: "No registrations found for this team" });
    res.json(registrationsWithTickets);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cancel Registration
exports.cancelRegistration = async (req, res) => {
  try {
    const { teamName, eventTitle } = req.params;

    const participant = await Participant.findOne({ Teamname: teamName });
    const event = await Event.findOne({ title: eventTitle });

    if (!participant || !event) return res.status(404).json({ message: "Team or Event not found" });

    const registration = await Registration.findOneAndUpdate(
      { ParticipantId: participant._id, eventId: event._id },
      { status: "Not Registered" },
      { new: true }
    );

    if (!registration) return res.status(404).json({ message: "Registration not found" });
    res.json({ message: "Registration cancelled", registration });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ---------------- TICKETS ----------------

// Generate Ticket
exports.generateTicket = async (req, res) => {
  try {
    const { Teamname, eventTitle } = req.body;

    const participant = await Participant.findOne({ Teamname });
    const event = await Event.findOne({ title: eventTitle });

    if (!participant || !event) return res.status(404).json({ message: "Team or Event not found" });

    const registration = await Registration.findOne({
      ParticipantId: participant._id,
      eventId: event._id,
      status: "Registered"
    });

    if (!registration) return res.status(400).json({ message: "Active registration not found for this event" });

    // Check if ticket already exists
    const existingTicket = await Ticket.findOne({ registrationId: registration._id });
    if (existingTicket) {
      return res.status(200).json({ 
        message: "Ticket already generated", 
        ticket: existingTicket 
      });
    }

    // Generate a human-readable ticket code
    const ticketCode = `TIC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Use ticket code for QR data
    const qrData = `${ticketCode}-${Teamname}-${eventTitle}`;
    const qrCodeImage = await QRCode.toDataURL(qrData);

    const ticket = new Ticket({
      ticketCode,
      registrationId: registration._id,
      userId: participant._id,
      eventId: event._id,
      qrCode: qrCodeImage,
      status: "Valid"
    });

    await ticket.save();

    res.status(201).json({
      message: "Ticket generated successfully",
      ticket
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Ticket Details
exports.getTicketDetails = async (req, res) => {
  try {
    const { ticketCode } = req.params;
    const ticket = await Ticket.findOne({ ticketCode })
      .populate("userId", "Teamname")
      .populate("eventId", "title location date");

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};