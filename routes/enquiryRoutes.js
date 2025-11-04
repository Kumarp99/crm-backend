// routes/enquiryRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../models');
const Enquiry = db.Enquiry;
const protect = require('../middleware/auth');

// --- 1. Submission API (POST /api/enquiries/public) - PUBLIC ---
// Logic: Save client details, set claimed=false, counselorId=null
router.post('/public', async (req, res) => {
    const { name, email, courseInterest } = req.body;
    try {
        const newEnquiry = await Enquiry.create({
            name,
            email,
            courseInterest,
            claimed: false, // Default set in model, but explicit for clarity
            counselorId: null // Default set in model, but explicit for clarity
        });
        // 201 Created status
        res.status(201).json({ message: "Enquiry submitted successfully. A counselor will contact you soon.", enquiry: newEnquiry });
    } catch (error) {
        // Handle common errors like database connection issues
        console.error("Enquiry submission error:", error);
        res.status(500).json({ message: "Server error during enquiry submission." });
    }
});


// --- 2. Fetch Unclaimed Leads (GET /api/enquiries/public) - PROTECTED (Step 7) ---
// Logic: Query where claimed is false or counselorId is null
router.get('/public', protect, async (req, res) => {
    try {
        const unclaimedLeads = await Enquiry.findAll({
            where: { claimed: false } // Assuming claimed=false implies counselorId=null, which is simpler
        });
        res.status(200).json(unclaimedLeads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving unclaimed leads." });
    }
});


// --- 3. Fetch Claimed Leads (GET /api/enquiries/private) - PROTECTED (Step 7) ---
// Logic: Query where counselorId matches the logged-in counselor ID (req.user)
router.get('/private', protect, async (req, res) => {
    try {
        const claimedLeads = await Enquiry.findAll({
            where: { counselorId: req.user } // req.user is set by the 'auth' middleware
        });
        res.status(200).json(claimedLeads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving claimed leads." });
    }
});


// --- 4. Claim Lead API (PATCH /api/enquiries/:id/claim) - PROTECTED (Step 7) ---
router.patch('/:id/claim', protect, async (req, res) => {
    const enquiryId = req.params.id;
    const counselorId = req.user; // ID of the logged-in counselor

    try {
        const enquiry = await Enquiry.findByPk(enquiryId);
        
        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found.' });
        }
        
        // CRITICAL BUSINESS LOGIC: Check if already claimed
        if (enquiry.claimed) {
            return res.status(409).json({ message: 'Enquiry is already claimed by a counselor.' }); // 409 Conflict
        }

        // Update the lead
        enquiry.claimed = true;
        enquiry.counselorId = counselorId;
        await enquiry.save();

        res.json({ message: 'Enquiry successfully claimed.', enquiry });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error claiming enquiry.' });
    }
});

module.exports = router;