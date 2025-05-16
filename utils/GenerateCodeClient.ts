import type { PromptBody } from "~/types/PromptBody";

export default async function(image: String, prompt?: String): Promise<GeneratedResponse> {
    let request: PromptBody = {
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

export interface GeneratedResponse {
    output?: {
        url?: string,
        prompt: string
    },
    error?: string
}