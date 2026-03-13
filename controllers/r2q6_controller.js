const Item = require("../models/r2q6_item");
const Claim = require("../models/r2q6_claim");

// Get all claims (admin)
exports.getAllClaims = async (req, res) => {
    try {
        const claims = await Claim.find().populate("itemId").sort({ createdAt: -1 });
        res.json(claims);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Report a lost item
exports.reportLostItem = async (req, res) => {
    try {
        const refId = `LOST-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const item = new Item({ ...req.body, refId, type: "Lost", status: "Open" });
        await item.save();
        res.status(201).json({ message: "Lost item reported successfully", refId, item });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Report a found item
exports.reportFoundItem = async (req, res) => {
    try {
        const refId = `FND-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const item = new Item({ ...req.body, refId, type: "Found", status: "Open" });
        await item.save();
        res.status(201).json({ message: "Found item reported successfully", refId, item });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// View all lost items
exports.getLostItems = async (req, res) => {
    try {
        const items = await Item.find({ type: "Lost" }).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// View all found items
exports.getFoundItems = async (req, res) => {
    try {
        const items = await Item.find({ type: "Found" }).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Match a found item with a lost report
exports.matchItems = async (req, res) => {
    try {
        const { lostRefId, foundRefId } = req.body;
        const lostItem = await Item.findOne({ refId: lostRefId });
        const foundItem = await Item.findOne({ refId: foundRefId });
        if (!lostItem || !foundItem) return res.status(404).json({ message: "Items not found" });

        lostItem.status = "Matched";
        lostItem.matchedWith = foundItem._id;
        
        foundItem.status = "Matched";
        foundItem.matchedWith = lostItem._id;

        await lostItem.save();
        await foundItem.save();

        res.json({ message: "Items matched successfully", lostItem, foundItem });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Claim an item
exports.claimItem = async (req, res) => {
    try {
        const { refId, claimantName, claimantContact, reason } = req.body;
        const item = await Item.findOne({ refId });

        if (!item || item.type !== "Found") {
            return res.status(404).json({ message: "Found item not found" });
        }

        const claim = new Claim({ itemId: item._id, claimantName, claimantContact, reason });
        await claim.save();

        item.status = "Claimed";
        await item.save();

        res.status(201).json({ message: "Claim request submitted", claim });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Approve item claim (admin)
exports.approveClaim = async (req, res) => {
    try {
        const { claimId } = req.params;
        const claim = await Claim.findById(claimId);

        if (!claim) return res.status(404).json({ message: "Claim not found" });

        claim.status = "Approved";
        await claim.save();

        const item = await Item.findById(claim.itemId);
        item.status = "Returned";
        await item.save();

        res.json({ message: "Claim approved and item marked as returned", claim });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Mark item as returned
exports.markAsReturned = async (req, res) => {
    try {
        const { refId } = req.params;
        const item = await Item.findOne({ refId });

        if (!item) return res.status(404).json({ message: "Item not found" });

        item.status = "Returned";
        await item.save();

        res.json({ message: "Item marked as returned", item });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Cancel claim request
exports.cancelClaim = async (req, res) => {
    try {
        const { claimId } = req.params;
        const claim = await Claim.findById(claimId);

        if (!claim) return res.status(404).json({ message: "Claim not found" });

        claim.status = "Cancelled";
        await claim.save();

        const item = await Item.findById(claim.itemId);
        if (item.status === "Claimed") {
            item.status = "Open";
            await item.save();
        }

        res.json({ message: "Claim request cancelled", claim });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
