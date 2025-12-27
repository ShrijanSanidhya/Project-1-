const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testGemini() {
    console.log("--- Gemini API Diagnostic Test ---");
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
        console.error("ERROR: GEMINI_API_KEY is missing in .env file");
        return;
    }

    const genAI = new GoogleGenerativeAI(key);

    try {
        console.log("Testing model: gemini-pro-latest");
        const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });

        console.log("Sending test prompt: 'Hello'...");
        const result = await model.generateContent("Hello");
        const response = await result.response;
        const text = response.text();

        console.log("SUCCESS! API responded:");
        console.log(text);
    } catch (error) {
        console.error("\nFATAL ERROR DETAILS:");
        console.error(error);
    }
}

testGemini();
