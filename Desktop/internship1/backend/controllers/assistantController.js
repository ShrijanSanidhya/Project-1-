const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chat = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Log the incoming request
        console.log("Received AI Chat Request:", message);

        // Use the model that we confirmed works (gemini-2.0-flash)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        // Log the successful response
        console.log("Gemini Response Generated:", text);

        res.json({ reply: text });
    } catch (error) {
        // Detailed error logging
        console.error("Gemini API Error Detail:", error);

        // FALLBACK / SIMULATION MODE
        // If API fails (Rate Limit 429 or other), return a JARVIS-like mock response
        // so the user can still verify the UI and Voice flow.
        const mockReplies = [
            "I am currently unable to access the neural net, Sir, but all systems are nominal.",
            "My connection to the cloud is restricted. I am operating in offline mode.",
            "I heard you, but I cannot process that request right now due to server limits.",
            "Greetings. I am here, though my cognitive functions are temporarily limited.",
            "Access denied at the moment. Please try again later, Sir."
        ];
        const randomReply = mockReplies[Math.floor(Math.random() * mockReplies.length)];

        console.log("Serving Simulation Response:", randomReply);
        res.json({ reply: randomReply, isMock: true });
    }
};
