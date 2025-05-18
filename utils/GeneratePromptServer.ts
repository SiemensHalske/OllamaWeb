import type { OllamaResponse, OllamaPromptResponse } from '~/types/Ollama';

export async function generatePrompt(image: String, prompt?: String): Promise<string> {
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