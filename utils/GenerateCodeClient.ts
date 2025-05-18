import type { PromptBody, ImagePromptBody } from "~/types/PromptBody";

export async function generateWithImage(image: String, prompt?: String): Promise<GeneratedResponse> {
    let request: ImagePromptBody = {
         image,
         prompt
    };

    return $fetch('/api/generate', {
        method: 'post',
        body: request
    })
    .then(async (res) => {
        return res as GeneratedResponse;
    });
}

export async function generate(prompt: String, id: String): Promise<GeneratedResponse> {
    let request: PromptBody = {
         prompt
    };

    return $fetch('/api/generate/' + id, {
        method: 'post',
        body: request
    })
    .then(async (res) => {
        return res as GeneratedResponse;
    });
}

export interface GeneratedResponse {
    output?: {
        url?: string,
        prompt: string
    },
    error?: string
}