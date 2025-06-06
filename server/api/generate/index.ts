import fs from 'node:fs';
import { randomUUID, createHash } from 'node:crypto';
import { ImagePromptBody } from "~/types/PromptBody";
import { GeneratedResponse } from "~/utils/GenerateCodeClient";
import { generateCode } from "~/utils/GenerateCodeServer";
import { generatePrompt } from "~/utils/GeneratePromptServer";

interface CacheEntry {
    prompt: string;
    url: string;
    timestamp: number;
}

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const cache = new Map<string, CacheEntry>();

export default defineEventHandler(async (event) => {
    if(event.method != 'POST') {
        setResponseStatus(event, 405);
        return;
    }
    if(getHeader(event, 'content-type') != 'application/json') {
        setResponseStatus(event, 400);
        return;
    }

    var body: ImagePromptBody = await readBody(event);
    if(body == undefined) {
        setResponseStatus(event, 400);
        return;
    }

    const cacheKey = createHash('sha256')
        .update(body.image + (body.prompt ?? ''))
        .digest('hex');

    const cached = cache.get(cacheKey);
    if(cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return { output: { prompt: cached.prompt, url: cached.url } } as GeneratedResponse;
    }

    var response: GeneratedResponse = {};
    try {
        let prompt = await generatePrompt(body.image, body.prompt);

        response = {
            output: {
                prompt: prompt
            }
        };

        let code = await generateCode(prompt);

        const id = randomUUID().toString();
        
        fs.writeFileSync(`./public/output/${id}.html`, code);

        cache.set(cacheKey, { prompt, url: `/output/${id}.html`, timestamp: Date.now() });

        response = {
            output: {
                prompt: prompt,
                url: `/output/${id}.html`
            }
        };
        
        return response;
    } catch(e: any) {
        response.error = e.message;
        console.error(e);
        setResponseStatus(event, 500);
        return response;
    }
});