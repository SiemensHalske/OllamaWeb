import { PromptBody } from "~/types/PromptBody";
import { GeneratedResponse } from "~/utils/GenerateCodeClient";
import fs from 'node:fs';
import { randomUUID } from "node:crypto";

export default defineEventHandler(async (event) => {
    if(event.method != 'POST') {
        setResponseStatus(event, 405);
        return;
    }
    if(getHeader(event, 'content-type') != 'application/json') {
        setResponseStatus(event, 400);
        return;
    }

    var body: PromptBody = await readBody(event);
    if(body == undefined) {
        setResponseStatus(event, 400);
        return;
    }

    console.log(body);
    try {
        let prompt = await generatePrompt(body.image, body.prompt);

        console.log(prompt);

        let code = await generateCode(prompt);

        console.log(code);

        const id = randomUUID().toString();
        
        fs.writeFileSync(`./public/output/${id}.html`, code);

        return {
            url: `output/${id}.html`
        } as GeneratedResponse;
    } catch(e) {
        console.error(e);
        setResponseStatus(event, 500);
        return {
            error: 'Failed to generate content'
        } as GeneratedResponse;
    }
})

async function generatePrompt(image: String, prompt?: String): Promise<string> {
    let result: OllamaResponse<OllamaPromptResponse> = await (await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            model: 'unitythemaker/llama3.2-vision-tools',
            messages: [
                {
                    role: 'system',
                    content: 'You are the designer of a team that only develops websites. Your role is to describe the design given in the image by the client for your team members so that they can write the code. Do not come up with stuff that is not given in the image or the users prompt. Answer in JSON-Format.'
                },
                {
                    role: 'user',
                    content: prompt ?? "Here is my image.",
                    images: [
                        image
                    ]
                }
            ],
            stream: false,
            temperatur: 0.0,
            tools: [
                {
                    type: 'function',
                    function: {
                        name: 'give_description',
                        description: 'Sends the description to the coding team so that they can code the website.',
                        parameters: {
                            type: 'object',
                            properties: {
                                description: {
                                    type: 'string',
                                    description: 'The description that should be sent'
                                }
                            }
                        },
                        required: [
                            'description'
                        ]
                    }
                }
            ]
        }),
    })).json();

    if(result == undefined || result.message.tool_calls == undefined || result.message.tool_calls.length <= 0) {
        console.log('Failed to generate prompt from image');
        throw new Error('Failed to generate prompt from image');
    }

    return result.message.tool_calls[0].function.arguments.description;
}

async function generateCode(prompt: String): Promise<string> {
    let result: OllamaResponse<OllamaCodeResponse> = await (await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            model: 'qwen2.5-coder',
            messages: [
                {
                    role: 'system',
                    content: 'You are the programmer of a team that only develops websites. Your role is to write the code for your team members. You will put all the code inside a single html file. Answer in JSON-Format.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            stream: false,
            temperatur: 0.0,
            tools: [
                {
                    type: 'function',
                    function: {
                        name: 'show_result',
                        description: 'Puts the result inside a html-file and displays the result to the user.',
                        parameters: {
                            type: 'object',
                            properties: {
                                content: {
                                    type: 'string',
                                    description: 'The content that should be put inside the html-file.'
                                }
                            }
                        },
                        required: [
                            'content'
                        ]
                    }
                }
            ]
        }),
    })).json();

    if(result == undefined || result.message.tool_calls == undefined || result.message.tool_calls.length <= 0) {
        console.log('Failed to generate code');
        throw new Error('Failed to generate code');
    }

    return result.message.tool_calls[0].function.arguments.content;
}

interface OllamaResponse<T> {
    model: String,
    created_at: String,
    message: {
        role: String,
        content: String,
        images?: String[],
        tool_calls?: T[]
    },
    done: boolean,
    total_duration: number,
    load_duration: number,
    prompt_eval_count: number,
    prompt_eval_duration: number,
    eval_count: number,
    eval_duration: number
}

interface OllamaPromptResponse {
    function: {
        name: String,
        arguments: {
            description: string
        }
    }
}

interface OllamaCodeResponse {
    function: {
        name: String,
        arguments: {
            content: string
        }
    }
}