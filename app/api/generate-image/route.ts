import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        console.log("Generating image for prompt:", prompt);

        // 1. "Smart Discovery": Try to find the correct Model ID
        // Target: "Nano Banana Pro" (Gemini 3 Pro Image Preview)
        // Valid Scanned IDs: 'models/gemini-3-pro-image-preview', 'models/nano-banana-pro-preview'
        let targetModelId = 'gemini-3-pro-image-preview';
        let foundSpecificModel = false;

        console.log("🔍 Searching for 'Nano Banana Pro' (Gemini 3)...");

        try {
            const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            if (modelsRes.ok) {
                const modelsData = await modelsRes.json();

                // Priority 1: Exact Match for Gemini 3 Pro Image
                const bestModel = modelsData.models?.find((m: any) =>
                    m.name === 'models/gemini-3-pro-image-preview' ||
                    m.name === 'models/nano-banana-pro-preview'
                );

                if (bestModel) {
                    targetModelId = bestModel.name.replace('models/', ''); // API often needs name without prefix or with... actually v1beta usually accepts 'models/...' but 'generateContent' url format is 'models/ID:generateContent'
                    // However, the previous code used just the ID for tuned, but let's be safe.
                    // Actually standard format is `models/gemini-3...` in the URL path.
                    // The 'name' field usually contains 'models/'.
                    targetModelId = bestModel.name;
                    console.log("✅ Found Best Model:", targetModelId);
                    foundSpecificModel = true;
                } else {
                    // Fallback to searching for 'banana'
                    const bananaModel = modelsData.models?.find((m: any) =>
                        (m.displayName || m.name || "").toLowerCase().includes('banana')
                    );
                    if (bananaModel) {
                        targetModelId = bananaModel.name;
                        console.log("✅ Found Fallback Banana Model:", targetModelId);
                        foundSpecificModel = true;
                    }
                }
            }
        } catch (e) {
            console.error("Model Discovery Failed:", e);
        }

        // 3. GENERATION WITH FALLBACK
        // Strategy: Try Primary (Pro) -> If 503/Error -> Try Fallback (Standard)
        const modelsToTry = [
            targetModelId,                    // Priority 1: What we found (Pro)
            'gemini-2.5-flash-image'          // Priority 2: Standard Nano Banana (Reliable)
        ];

        let lastError;

        for (const modelId of modelsToTry) {
            try {
                console.log(`🚀 Attempting generation with Model ID: ${modelId}`);

                // Correct model ID formatting for URL if needed (remove 'models/' if present, or keep based on API)
                // The API usually takes `models/ID` or just `ID`. We'll use the clean ID if possible, but our `targetModelId` might have `models/` prefix logic from before.
                // Let's sanitize.
                const cleanModelId = modelId.replace('models/', '');
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModelId}:generateContent?key=${apiKey}`;

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `Generate a RAW candid photograph of a KOREAN person: "${prompt}, 24 years old, soft natural skin texture, youthful glow, unedited, fujifilm tone, instagram style". 
                               Negative prompt: (drawing, illustration, cgi, 3d render, painting, anime, cartoon, plastic skin, excessive wrinkles, rough skin, old, ugly, deformed). 
                               Return ONLY the image data.`
                            }]
                        }]
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.warn(`⚠️ Model '${modelId}' failed: ${response.status} ${errorText}`);

                    // Specific Handling for 503 (Overloaded)
                    if (response.status === 503) {
                        console.log("Servers overloaded. Switching to fallback model...");
                        lastError = new Error(`Model overloaded (503)`);
                        continue; // Try next model
                    }

                    throw new Error(`API Error ${response.status}: ${errorText}`);
                }

                const data = await response.json();
                const parts = data.candidates?.[0]?.content?.parts || [];
                const imagePart = parts.find((p: any) => p.inlineData && p.inlineData.mimeType.startsWith('image'));

                if (imagePart) {
                    const base64Image = imagePart.inlineData.data;
                    const mimeType = imagePart.inlineData.mimeType;
                    const imageUrl = `data:${mimeType};base64,${base64Image}`;
                    console.log(`✅ Image generated successfully using ${modelId}`);
                    return NextResponse.json({ imageUrl });
                }

                // If text was returned instead of image
                const textPart = parts.find((p: any) => p.text);
                if (textPart) {
                    throw new Error("Model returned text instead of image: " + textPart.text.substring(0, 50));
                }

                throw new Error("No image data found in response");

            } catch (error: any) {
                console.error(`Attempt failed for ${modelId}:`, error.message);
                lastError = error;
                // Continue to next model in list
            }
        }

        // If all attempts fail
        throw lastError || new Error("All image generation models failed.");

    } catch (error: any) {
        console.error("Image Generation Error (Nano Banana Pro):", error);

        // USER REQUEST: STRICTLY NO FALLBACK.
        // If Nano Banana Pro fails, we return the error code so the user can see it in valid UI.

        return NextResponse.json(
            { error: "Image generation failed (Nano Banana Pro)", details: error.message },
            { status: 500 }
        );
    }
}
