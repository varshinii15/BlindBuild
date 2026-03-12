# BlindBuild Hub - Full API Documentation

This document provides a comprehensive list of all routes, methods, and expected data for the BlindBuild event management system.

---

## 🚀 Base URL
- **Local:** `http://localhost:5000/api/round2`
- **Production:** `https://csea.psgtech.ac.in/blindbuild/api/round2`

---

## 1. Registration & Event Matrix (R2Q1)
**Description:** Manages team formation, event listings, and participant registration.

| Function | Method | Endpoint | Payload (Body/Query) |
| :--- | :--- | :--- | :--- |
| **Create Team** | `POST` | `/events/teams` | `{ "Teamname": "String", "TeamMembers": [{"name": "S", "email": "S"}], "password": "String" }` |
| **List Events** | `GET` | `/events/events` | *None* |
| **Register for Event** | `POST` | `/events/register` | `{ "ParticipantId": "ObjectId", "eventId": "ObjectId" }` |
| **Registration Status** | `GET` | `/events/registration-status/:id` | `id` (Param) |
| **Cancel Registration** | `DELETE` | `/events/cancel-registration/:id` | `id` (Param) |
| **Generate Ticket** | `POST` | `/events/ticket` | `{ "registrationId": "ObjectId", "userId": "String", "eventId": "ObjectId" }` |
| **Get Ticket Details** | `GET` | `/events/ticket/:id` | `id` (Param) |

---

## 2. Workshop Chrono-Scheduler (R2Q2)
**Description:** Handles workshop slot discovery and seat reservations.

| Function | Method | Endpoint | Payload (Body/Query) |
| :--- | :--- | :--- | :--- |
| **List Workshops** | `GET` | `/w-s/workshops` | *None* |
| **Workshop Details** | `GET` | `/w-s/workshops/:id` | `id` (Param) |
| **View Slots** | `GET` | `/w-s/workshops/:id/slots` | `id` (Param) |
| **Book Slot** | `POST` | `/w-s/book-slot` | `{ "workshopId": "ObjectId", "slotId": "ObjectId", "userId": "String" }` |
| **Cancel Booking** | `DELETE` | `/w-s/cancel-slot` | `{ "bookingId": "ObjectId" }` |
| **Booking Status** | `GET` | `/w-s/booking-status` | `?userId=U123` (Query) |

---

## 3. Command Center & Convenor Hub (R2Q4)
**Description:** Administrative tools for attendance, winners, and QR verification.

| Function | Method | Endpoint | Payload (Body/Query) |
| :--- | :--- | :--- | :--- |
| **Create Event** | `POST` | `/convenor/events` | `{ "title": "String", "description": "String", ... }` |
| **Verify Ticket** | `POST` | `/convenor/verify-ticket` | `{ "ticketId": "String" }` |
| **Mark Attendance** | `POST` | `/convenor/attendance-mark` | `{ "ticketId": "String" }` |
| **Undo Attendance** | `POST` | `/convenor/attendance-undo` | `{ "ticketId": "String" }` |
| **View Attendance** | `GET` | `/convenor/attendance` | *None* |
| **Participant Info** | `GET` | `/convenor/participant` | `?id=ObjectId` (Query) |
| **Generate Badge** | `GET` | `/convenor/badge` | `?ticketId=String` (Query) |
| **List All Teams** | `GET` | `/convenor/teams` | *None* |
| **Add Winner** | `POST` | `/convenor/winner` | `{ "eventId": "ObjectId", "participantId": "ObjectId", "position": "String", "prizeName": "String" }` |
| **Update Winner** | `PUT` | `/convenor/winner/:id` | `{ "position": "New Value", ... }` |
| **Delete Winner** | `DELETE` | `/convenor/winner/:id` | `id` (Param) |
| **Winners by Event** | `GET` | `/convenor/winners/event/:eventId` | `eventId` (Param) |

---

## 4. Sentiment & Pulse Analytics (R2Q5)
**Description:** Captures participant feedback and calculates event ratings.

| Function | Method | Endpoint | Payload (Body/Query) |
| :--- | :--- | :--- | :--- |
| **Submit Feedback** | `POST` | `/f-r/feedback` | `{ "participantId": "ObjectId", "comment": "String" }` |
| **View Feedback** | `GET` | `/f-r/feedback` | *None* |
| **Edit Feedback** | `PUT` | `/f-r/feedback/:id` | `{ "comment": "Updated String" }` |
| **Delete Feedback** | `DELETE` | `/f-r/feedback/:id` | `id` (Param) |
| **Submit Rating** | `POST` | `/f-r/rating` | `{ "participantId": "ObjectId", "score": Number }` |
| **Average Rating** | `GET` | `/f-r/rating/average` | *None* |

---

## 5. Nexus Lost & Found (R2Q6)
**Description:** Tracking and management system for misplaced items.

| Function | Method | Endpoint | Payload (Body/Query) |
| :--- | :--- | :--- | :--- |
| **Report Lost** | `POST` | `/l-f/lost` | `{ "itemName": "S", "description": "S", "category": "S", "location": "S", "reporterName": "S", "reporterContact": "S" }` |
| **Report Found** | `POST` | `/l-f/found` | `{Same payload as above}` |
| **View Lost** | `GET` | `/l-f/lost` | *None* |
| **View Found** | `GET` | `/l-f/found` | *None* |
| **Match Items** | `POST` | `/l-f/match` | `{ "lostItemId": "ObjectId", "foundItemId": "ObjectId" }` |
| **Claim Item** | `POST` | `/l-f/claim` | `{ "itemId": "ObjectId", "claimantName": "S", "claimantContact": "S", "reason": "S" }` |
| **Approve Claim** | `PUT` | `/l-f/claim/approve/:claimId` | `claimId` (Param) |
| **Cancel Claim** | `PUT` | `/l-f/claim/cancel/:claimId` | `claimId` (Param) |
| **Mark Returned** | `PUT` | `/l-f/item/returned/:itemId` | `itemId` (Param) |
