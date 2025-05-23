import fs from 'node:fs';
import { randomUUID } from "node:crypto";
import { ImagePromptBody } from "~/types/PromptBody";
import { GeneratedResponse } from "~/utils/GenerateCodeClient";
import { generateCode } from "~/utils/GenerateCodeServer";
import { generatePrompt } from "~/utils/GeneratePromptServer";

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