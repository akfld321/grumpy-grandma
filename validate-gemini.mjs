
import { GoogleGenerativeAI } from "@google/generative-ai";

import fs from 'fs';
import path from 'path';

// Manually load .env.local because dotenv doesn't auto-load it
const envDetails = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
const apiKeyMatch = envDetails.match(/GEMINI_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!apiKey) {
    console.error("Could not find GEMINI_API_KEY in .env.local");
    process.exit(1);
}

console.log("Testing API Key:", apiKey.slice(0, 5) + "...");

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log("Fetching available models...");
        // Note: listModels is not directly exposed on the main class in some versions, 
        // but let's try a simple generation to 'gemini-1.5-flash' first to see if it works, 
        // or just rely on the error message which usually lists models.
        // Actually, the SDK doesn't have a clean 'listModels' helper in the client-side instance easily without admin SDK sometimes.
        // Let's try a direct fetch to the API endpoint for listing models to be sure.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("\n=== Available Models ===");
            data.models.forEach(m => {
                if (m.name.includes('gemini')) {
                    console.log(`- ${m.name.replace('models/', '')} (${m.displayName})`);
                }
            });
        } else {
            console.error("Failed to list models:", data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
