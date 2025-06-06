export interface OllamaResponse<T> {
    model: string,
    created_at: string,
    message: {
        role: string,
        content: string,
        images?: string[],
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

export interface OllamaPromptResponse {
    function: {
        name: string,
        arguments: {
            description: string
        }
    }
}

export interface OllamaCodeResponse {
    function: {
        name: string,
        arguments: {
            content: string
        }
    }
}