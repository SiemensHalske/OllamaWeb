export interface OllamaResponse<T> {
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

export interface OllamaPromptResponse {
    function: {
        name: String,
        arguments: {
            description: string
        }
    }
}

export interface OllamaCodeResponse {
    function: {
        name: String,
        arguments: {
            content: string
        }
    }
}