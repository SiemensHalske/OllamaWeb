import fs from 'node:fs';
import { PromptBody } from "~/types/PromptBody";
import { GeneratedResponse } from "~/utils/GenerateCodeClient";
import { generateCode } from '~/utils/GenerateCodeServer';

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    
    if(id === undefined) {
        setResponseStatus(event, 404);
        return;
    }
    if(event.method != 'POST') {
        setResponseStatus(event, 405);
        return;
    }
    if(getHeader(event, 'content-type') != 'application/json') {
        setResponseStatus(event, 400);        
        return;
    }

    var body: PromptBody = await readBody(event);
    if(body == undefined || body.prompt == undefined) {
        setResponseStatus(event, 400);
        return;
    }

    var response: GeneratedResponse = {};
    const path = `./public/output/${id}.html`;
    try {
        const currentCode = fs.readFileSync(path, { encoding: 'utf-8' });
        const code = await generateCode(body.prompt, currentCode);
        
        fs.writeFileSync(path, code);
        
        return response;
    } catch(e: any) {
        response.error = e.message;
        console.error(e);
        setResponseStatus(event, 500);
        return response;
    }
});