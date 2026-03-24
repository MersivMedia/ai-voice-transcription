const { OpenAI } = require('openai');

let openai;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text: inputData } = req.body;

    if (!inputData || inputData.trim().length === 0) {
        return res.status(400).json({ error: 'Input required' });
    }

    try {
        // Demo response
        if (!openai) {
            return res.json({ result: "Demo response for ai-voice-transcription" });
        }

        // Real AI call would go here
        res.json({ result: "AI response placeholder" });

    } catch (error) {
        res.status(500).json({ error: 'Generation failed' });
    }
}