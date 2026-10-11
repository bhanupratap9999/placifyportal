const Newsletter = require('../models/Newsletter');

// AI-based newsletter generation from a prompt
exports.generateNewsletterFromPrompt = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || prompt.trim().length === 0) {
            return res.status(400).json({ success: false, message: 'Prompt is required' });
        }

        const effectiveKey = process.env.GEMINI_API_KEY;
        if (!effectiveKey) {
            return res.status(500).json({ success: false, message: 'Gemini API key is not configured on the server' });
        }

        const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
        const systemPrompt = `You are an assistant that creates concise, student-facing newsletters for a company. Given a user's prompt, return a JSON object with keys: title (short, <= 100 chars), summary (short <= 200 chars), content (HTML string with paragraphs and simple markup). Respond ONLY with valid JSON.`;
        const requestPrompt = `${systemPrompt}\n\nUser prompt: ${prompt}`;
        let text;

        try {
            const { GoogleGenAI } = require('@google/genai');
            const ai = new GoogleGenAI({ apiKey: effectiveKey });
            const response = await ai.models.generateContent({
                model,
                contents: requestPrompt,
                config: { temperature: 0.3, responseMimeType: 'application/json' }
            });
            text = response?.text || '';
        } catch (aiErr) {
            console.error('Gemini newsletter generation failed:', aiErr.message);
            return res.status(aiErr.status === 503 ? 503 : 502).json({
                success: false,
                message: 'Gemini could not generate the newsletter. Please try again.'
            });
        }

        // Models may wrap JSON in markdown fences even when asked for JSON only.
        const cleanedText = text
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim();

        // Try to parse JSON from text
        let parsed = null;
        try { parsed = JSON.parse(cleanedText); } catch (e) {
            const start = cleanedText.indexOf('{');
            const end = cleanedText.lastIndexOf('}');
            if (start !== -1 && end !== -1) {
                const sub = cleanedText.substring(start, end + 1);
                try { parsed = JSON.parse(sub); } catch (e2) { parsed = null; }
            }
        }

        if (parsed && typeof parsed === 'object') {
            parsed.title = typeof parsed.title === 'string' ? parsed.title.trim() : '';
            parsed.summary = typeof parsed.summary === 'string' ? parsed.summary.trim() : '';
            parsed.content = typeof parsed.content === 'string' ? parsed.content.trim() : '';
            if (!parsed.title || !parsed.summary || !parsed.content) parsed = null;
        }

        if (!parsed) {
            return res.status(502).json({ success: false, message: 'Gemini returned an invalid newsletter. Please try again.' });
        }

        res.status(200).json({ success: true, newsletter: parsed });
    } catch (error) {
        console.error('Generate newsletter error:', error);
        res.status(500).json({ success: false, message: 'Error generating newsletter', error: error.message });
    }
};

// @desc    Get all published newsletters
// @route   GET /api/newsletters
// @access  Public
exports.getAllNewsletters = async (req, res) => {
    try {
        const newsletters = await Newsletter.find({ status: 'Published' })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: newsletters.length,
            newsletters
        });

    } catch (error) {
        console.error('Get newsletters error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching newsletters',
            error: error.message
        });
    }
};

// @desc    Get single newsletter
// @route   GET /api/newsletters/:id
// @access  Public
exports.getNewsletter = async (req, res) => {
    try {
        const newsletter = await Newsletter.findById(req.params.id);

        if (!newsletter) {
            return res.status(404).json({
                success: false,
                message: 'Newsletter not found'
            });
        }

        res.status(200).json({
            success: true,
            newsletter
        });

    } catch (error) {
        console.error('Get newsletter error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching newsletter',
            error: error.message
        });
    }
};

// @desc    Create new newsletter
// @route   POST /api/newsletters
// @access  Private (Company only)
exports.createNewsletter = async (req, res) => {
    try {
        const { title, company, summary, content, status } = req.body;

        // Verify user is a company
        if (req.user.userType !== 'company') {
            return res.status(403).json({
                success: false,
                message: 'Only companies can create newsletters'
            });
        }

        const newsletter = await Newsletter.create({
            title,
            company,
            companyId: req.user.id,
            summary,
            content,
            status: status || 'Published'
        });

        // Emit real-time event to connected clients (students) so they can see new newsletter immediately
        try {
            const io = req.app.get('io');
            if (io) {
                io.emit('newNewsletter', newsletter);
            }
        } catch (emitErr) {
            console.error('Error emitting newNewsletter:', emitErr);
        }

        res.status(201).json({
            success: true,
            message: 'Newsletter created successfully',
            newsletter
        });

    } catch (error) {
        console.error('Create newsletter error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating newsletter',
            error: error.message
        });
    }
};

// @desc    Update newsletter
// @route   PUT /api/newsletters/:id
// @access  Private (Company owner only)
exports.updateNewsletter = async (req, res) => {
    try {
        const newsletter = await Newsletter.findById(req.params.id);

        if (!newsletter) {
            return res.status(404).json({
                success: false,
                message: 'Newsletter not found'
            });
        }

        // Check if user owns this newsletter
        if (newsletter.companyId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this newsletter'
            });
        }

        const updatedNewsletter = await Newsletter.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Newsletter updated successfully',
            newsletter: updatedNewsletter
        });

    } catch (error) {
        console.error('Update newsletter error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating newsletter',
            error: error.message
        });
    }
};

// @desc    Delete newsletter
// @route   DELETE /api/newsletters/:id
// @access  Private (Company owner only)
exports.deleteNewsletter = async (req, res) => {
    try {
        const newsletter = await Newsletter.findById(req.params.id);

        if (!newsletter) {
            return res.status(404).json({
                success: false,
                message: 'Newsletter not found'
            });
        }

        // Check if user owns this newsletter
        if (newsletter.companyId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this newsletter'
            });
        }

        await Newsletter.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Newsletter deleted successfully'
        });

    } catch (error) {
        console.error('Delete newsletter error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting newsletter',
            error: error.message
        });
    }
};

// @desc    Get company's newsletters
// @route   GET /api/newsletters/company/my-newsletters
// @access  Private (Company only)
exports.getCompanyNewsletters = async (req, res) => {
    try {
        if (req.user.userType !== 'company') {
            return res.status(403).json({
                success: false,
                message: 'Only companies can access this route'
            });
        }

        const newsletters = await Newsletter.find({ companyId: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: newsletters.length,
            newsletters
        });

    } catch (error) {
        console.error('Get company newsletters error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching newsletters',
            error: error.message
        });
    }
};
