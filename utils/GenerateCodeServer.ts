import type { OllamaResponse, OllamaCodeResponse } from '~/types/Ollama';
import chalk from 'chalk';

const MAX_RETRIES = 5;
const INITIAL_DELAY_MS = 500;

export async function generateCode(prompt: string, currentCode?: string, attempt = 0): Promise<string> {
    const messages = [];
    messages.push({
        role: 'system',
        content: 'You are the programmer of a team that only develops websites. Your role is to write the code for your team members. You will put all the code inside a single html file. You are building the website without any framework in html, css and js. Answer in JSON-Format.'
    });
    if(currentCode != undefined) {
        messages.push({
            role: 'system',
            content: `Currently the code looks like this:\n${currentCode}`
        });
    }
    messages.push({
        role: 'user',
        content: prompt
    });

    let result: OllamaResponse<OllamaCodeResponse> = await (await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            model: 'qwen2.5-coder',
            messages,
            stream: false,
            temperature: 0.0,
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
        if(attempt >= MAX_RETRIES) {
            throw new Error('Failed to generate code after maximum retries');
        }

        const delay = INITIAL_DELAY_MS * (2 ** attempt);
        console.log(chalk.yellow(`Failed to generate code. Retrying in ${delay}ms... (${attempt + 1}/${MAX_RETRIES})`));
        await new Promise((res) => setTimeout(res, delay));
        return generateCode(prompt, currentCode, attempt + 1);
    }

    return result.message.tool_calls[0].function.arguments.content;
}