const express = require("express");
const router = express.Router();
const lnfController = require("../controllers/r2q6_controller");

// Lost & Found Routes

// Report
router.post("/lost", lnfController.reportLostItem);
router.post("/found", lnfController.reportFoundItem);

// View
router.get("/lost", lnfController.getLostItems);
router.get("/found", lnfController.getFoundItems);

// Match
router.post("/match", lnfController.matchItems);

// Claim
router.post("/claim", lnfController.claimItem);
router.put("/claim/approve/:claimId", lnfController.approveClaim);
router.put("/claim/cancel/:claimId", lnfController.cancelClaim);

// Status
router.put("/item/returned/:itemId", lnfController.markAsReturned);

module.exports = router;
