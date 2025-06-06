import type { OllamaResponse, OllamaPromptResponse } from '~/types/Ollama';
import chalk from 'chalk';

export async function generatePrompt(image: string, prompt?: string, retries: number = 3): Promise<string> {
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
                    content: "You are a website design interpreter for a development team. Your role is to analyze the design provided in the given image or described by the client and translate it into a structured JSON format for your team members. Follow these guidelines strictly: Only describe elements explicitly visible or stated in the image or user prompt. Do not infer or assume any details that are not present. Use precise and consistent terminology for design components (e.g., 'header', 'footer', 'button', 'text', 'image', etc.). Clearly specify properties for each element, such as dimensions, colors, fonts, text content, alignment, and positions, if provided. If a property is not mentioned or visible, exclude it from the JSON. Do not include any additional features, interpretations, or creative liberties beyond what is explicitly provided. Ensure that your response strictly adheres to the structure and includes only the details explicitly provided in the input. For most Websites, the layout of elements is a key part, so describe this part in the highest detail. Validate your output to ensure it conforms to proper JSON syntax. Always format your response as a valid JSON object.",
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
            temperature: 0.5,
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
                                    description: 'The description that should be sent. The longer the better.'
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
        if(retries <= 0) {
            throw new Error('Failed to generate prompt from image');
        }
        console.log(chalk.yellow('Failed to generate prompt from image. Trying again...'));
        return generatePrompt(image, prompt, retries - 1);
    }

    return result.message.tool_calls[0].function.arguments.description;
}