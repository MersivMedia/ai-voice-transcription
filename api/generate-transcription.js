const { OpenAI } = require('openai');

let openai;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text: inputData } = req.body;

    if (!inputData || inputData.trim().length === 0) {
        return res.status(400).json({ error: 'Input text is required' });
    }

    try {
        // Demo mode fallback when no API key
        if (!openai) {
            return res.json({
                result: `**TRANSCRIPTION COMPLETE**\n\n**Meeting:** Product Strategy Discussion\n**Duration:** 32 minutes\n**Participants:** Sarah (Product Manager), Mike (Developer), Lisa (Designer)\n\n---\n\n**[00:01:15] Sarah:** Good morning everyone. Let's start with the Q3 roadmap review. Mike, can you walk us through the technical feasibility of the new user dashboard?\n\n**[00:01:32] Mike:** Absolutely. We've analyzed the requirements and identified three main technical challenges. First, the real-time data visualization will require WebSocket integration. Second, we'll need to optimize our database queries to handle the increased load. Third, the mobile responsive design needs careful consideration for performance.\n\n**[00:02:18] Lisa:** From a UX perspective, I've created wireframes that address the mobile-first approach. The key insight from user research is that 70% of our users access the dashboard on mobile devices, so we should prioritize that experience.\n\n**[00:02:45] Sarah:** That's crucial data. What's the estimated timeline for implementation?\n\n**[00:02:51] Mike:** Given the scope, I'd estimate 8-10 weeks for full implementation, including testing and QA. We could deliver an MVP in 6 weeks if we focus on core features first.\n\n**[00:03:12] Lisa:** I recommend the phased approach. We can gather user feedback on the MVP and iterate before building advanced features.\n\n**[Action Items:]**\n• Mike: Technical specification document by Friday\n• Lisa: Final wireframes and prototypes by Wednesday\n• Sarah: Stakeholder alignment meeting next Monday`,
                demo: true,
                message: "This is a demo response. Add OPENAI_API_KEY environment variable for live AI generation."
            });
        }

        // Real OpenAI API call
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are an expert transcriptionist with perfect accuracy in speech-to-text conversion. Create clean, properly formatted transcriptions with speaker identification, timestamps when relevant, and clear paragraph breaks. Handle multiple speakers and technical terminology.`
                },
                {
                    role: "user", 
                    content: inputData
                }
            ],
            max_tokens: 2000,
            temperature: 0.7,
        });

        const result = completion.choices[0].message.content;

        res.json({
            result: result,
            demo: false
        });

    } catch (error) {
        console.error('Error:', error);
        
        // Fallback to demo response on error
        res.json({
            result: `**TRANSCRIPTION COMPLETE**\n\n**Meeting:** Product Strategy Discussion\n**Duration:** 32 minutes\n**Participants:** Sarah (Product Manager), Mike (Developer), Lisa (Designer)\n\n---\n\n**[00:01:15] Sarah:** Good morning everyone. Let's start with the Q3 roadmap review. Mike, can you walk us through the technical feasibility of the new user dashboard?\n\n**[00:01:32] Mike:** Absolutely. We've analyzed the requirements and identified three main technical challenges. First, the real-time data visualization will require WebSocket integration. Second, we'll need to optimize our database queries to handle the increased load. Third, the mobile responsive design needs careful consideration for performance.\n\n**[00:02:18] Lisa:** From a UX perspective, I've created wireframes that address the mobile-first approach. The key insight from user research is that 70% of our users access the dashboard on mobile devices, so we should prioritize that experience.\n\n**[00:02:45] Sarah:** That's crucial data. What's the estimated timeline for implementation?\n\n**[00:02:51] Mike:** Given the scope, I'd estimate 8-10 weeks for full implementation, including testing and QA. We could deliver an MVP in 6 weeks if we focus on core features first.\n\n**[00:03:12] Lisa:** I recommend the phased approach. We can gather user feedback on the MVP and iterate before building advanced features.\n\n**[Action Items:]**\n• Mike: Technical specification document by Friday\n• Lisa: Final wireframes and prototypes by Wednesday\n• Sarah: Stakeholder alignment meeting next Monday`,
            demo: true,
            message: "Temporary issue with AI service. Showing demo response.",
            error: error.message
        });
    }
}