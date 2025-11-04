// enquiryController.js snippet - inside the claimLead function
// Assume Enquiry model is imported, and auth middleware ran to set req.user
const claimLead = async (req, res) => {
    const enquiryId = req.params.id;
    const counselorId = req.user; // ID from JWT payload

    try {
        const enquiry = await Enquiry.findByPk(enquiryId);

        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        // --- CRITICAL BUSINESS LOGIC CHECK ---
        if (enquiry.claimed === true) {
            return res.status(409).json({ message: 'This lead has already been claimed.' });
        }
        // ------------------------------------

        // Update and save
        enquiry.claimed = true;
        enquiry.counselorId = counselorId;
        await enquiry.save();

        res.status(200).json({ message: 'Lead claimed successfully', enquiry });

    } catch (error) {
        // Handle database or server errors
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
