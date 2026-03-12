# Round 2 Technical Modules - System Documentation

---

## 🚀 Base URL
- **Local:** `http://localhost:5000/api/round2`
- **Production:** `https://csea.psgtech.ac.in/blindbuild/api/round2`

---

## 1. Participant & Event Registration (R2Q1)
**System Description:**
This module manages team formation and event sign-ups for the festival. It allows participants to create teams with secure passwords and register for specific technical events. The system also generates unique digital tickets for each team, ensuring a smooth transition from registration to physical entry at the venue.

| Function | Method | Endpoint | Payload (Body/Query) |
| :--- | :--- | :--- | :--- |
| **Create Team** | `POST` | `/events/teams` | `{ "Teamname": "String", "TeamMembers": [{"name": "String", "email": "String"}], "password": "String" }` |
| **List Events** | `GET` | `/events/events` | *None* |
| **Register for Event** | `POST` | `/events/register` | `{ "ParticipantId": "ObjectId", "eventId": "ObjectId" }` |
| **Registration Status** | `GET` | `/events/registration-status/:id` | `id` (Param) |
| **Cancel Registration** | `DELETE` | `/events/cancel-registration/:id` | `id` (Param) |
| **Generate Ticket** | `POST` | `/events/ticket` | `{ "registrationId": "ObjectId", "userId": "String", "eventId": "ObjectId" }` |
| **Get Ticket Details** | `GET` | `/events/ticket/:id` | `id` (Param) |

---

## 2. Workshop Slot Booking System (R2Q2)
**System Description:**
This module handles the scheduling and seat reservation for various technical workshops. It provides a real-time list of available time slots and ensures that seats are allocated fairly without overbooking. Participants can easily browse all workshops, book their preferred slots, and manage their personal schedules instantly.

| Function | Method | Endpoint | Payload (Body/Query) |
| :--- | :--- | :--- | :--- |
| **List Workshops** | `GET` | `/w-s/workshops` | *None* |
| **Workshop Details** | `GET` | `/w-s/workshops/:id` | `id` (Param) |
| **View Slots** | `GET` | `/w-s/workshops/:id/slots` | `id` (Param) |
| **Book Slot** | `POST` | `/w-s/book-slot` | `{ "workshopId": "ObjectId", "slotId": "ObjectId", "userId": "String" }` |
| **Cancel Booking** | `DELETE` | `/w-s/cancel-slot` | `{ "bookingId": "ObjectId" }` |
| **Booking Status** | `GET` | `/w-s/booking-status` | `?userId=String` (Query) |

---

## 3. Convenor & Event Management Hub (R2Q4)
**System Description:**
This is a central tool for event organizers to manage on-ground operations efficiently. It features a secure ticket verification system to handle participant check-ins and log attendance in real-time. Convenors can also use this hub to announce official event winners and record prize details, keeping all data organized and transparent.

| Function | Method | Endpoint | Payload (Body/Query) |
| :--- | :--- | :--- | :--- |
| **Create Event** | `POST` | `/convenor/events` | `{ "title": "String", "description": "String", "date": "Date", "location": "String", "capacity": "Number" }` |
| **Verify Ticket** | `POST` | `/convenor/verify-ticket` | `{ "ticketId": "String" }` |
| **Mark Attendance** | `POST" | `/convenor/attendance-mark` | `{ "ticketId": "String" }` |
| **Undo Attendance** | `POST` | `/convenor/attendance-undo` | `{ "ticketId": "String" }` |
| **View Attendance** | `GET` | `/convenor/attendance` | *None* |
| **Participant Info** | `GET` | `/convenor/participant` | `?id=ObjectId` (Query) |
| **Generate Badge** | `GET` | `/convenor/badge` | `?ticketId=String` (Query) |
| **List All Teams** | `GET` | `/convenor/teams` | *None* |
| **Add Winner** | `POST` | `/convenor/winner` | `{ "eventId": "ObjectId", "participantId": "ObjectId", "position": "String", "prizeName": "String" }` |
| **Update Winner** | `PUT` | `/convenor/winner/:id` | `{ "eventId": "ObjectId", "participantId": "ObjectId", "position": "String", "prizeName": "String" }` |
| **Delete Winner** | `DELETE` | `/convenor/winner/:id` | `id` (Param) |
| **Winners by Event** | `GET` | `/convenor/winners/event/:eventId` | `eventId` (Param) |

---

## 4. Feedback & Rating Analysis Engine (R2Q5)
**System Description:**
This module captures participant experiences to help improve future event quality. It allows users to submit qualitative feedback and give numerical ratings for the events they attended. The system automatically calculates average scores and provides organizers with immediate insights into overall participant satisfaction.

| Function | Method | Endpoint | Payload (Body/Query) |
| :--- | :--- | :--- | :--- |
| **Submit Feedback** | `POST` | `/f-r/feedback` | `{ "participantId": "ObjectId", "comment": "String" }` |
| **View Feedback** | `GET` | `/f-r/feedback` | *None* |
| **Edit Feedback** | `PUT` | `/f-r/feedback/:id` | `{ "comment": "String" }` |
| **Delete Feedback** | `DELETE` | `/f-r/feedback/:id" | `id` (Param) |
| **Submit Rating** | `POST` | `/f-r/rating` | `{ "participantId": "ObjectId", "score": "Number" }` |
| **Average Rating** | `GET` | `/f-r/rating/average` | *None* |

---

## 5. Lost & Found Asset Registry (R2Q6)
**System Description:**
This module provides a structured way to track misplaced and discovered items across the campus. It manages the entire process from reporting a lost item to matching it with a found record and validating claims. By centralizing these reports, the system makes it much faster for owners to recover their belongings securely.

| Function | Method | Endpoint | Payload (Body/Query) |
| :--- | :--- | :--- | :--- |
| **Report Lost** | `POST` | `/l-f/lost` | `{ "itemName": "String", "description": "String", "category": "String", "location": "String", "reporterName": "String", "reporterContact": "String" }` |
| **Report Found** | `POST` | `/l-f/found` | `{ "itemName": "String", "description": "String", "category": "String", "location": "String", "reporterName": "String", "reporterContact": "String" }` |
| **View Lost** | `GET` | `/l-f/lost` | *None* |
| **View Found** | `GET` | `/l-f/found` | *None* |
| **Match Items** | `POST` | `/l-f/match` | `{ "lostItemId": "ObjectId", "foundItemId": "ObjectId" }` |
| **Claim Item** | `POST` | `/l-f/claim` | `{ "itemId": "ObjectId", "claimantName": "String", "claimantContact": "String", "reason": "String" }` |
| **Approve Claim** | `PUT` | `/l-f/claim/approve/:claimId` | `claimId` (Param) |
| **Cancel Claim** | `PUT` | `/l-f/claim/cancel/:claimId` | `claimId` (Param) |
| **Mark Returned** | `PUT` | `/l-f/item/returned/:itemId` | `itemId` (Param) |
