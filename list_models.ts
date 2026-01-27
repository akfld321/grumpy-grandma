
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("No API KEY found");
    process.exit(1);
}

// Fetch models via REST because SDK list_models might be slightly different or older in types
async function listModels() {
    console.log("Fetching available models...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("=== Available Models ===");
            data.models.forEach((m: any) => {
                console.log(`- ${m.name} (${m.displayName})`);
                console.log(`  Supported: ${m.supportedGenerationMethods.join(', ')}`);
            });
        } else {
            console.error("No models found or error:", data);
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

listModels();
