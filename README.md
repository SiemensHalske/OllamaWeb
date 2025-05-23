# OllamaWeb
A tool to turn images into websites similar to Lovable, Bolt and Figma Make, just not as refined and capable. It uses the open source Ollama to run the Multi-Modal LLMs locally.

## Getting Started with development
0. Install [bun](https://bun.sh/docs/installation)

1. Start Ollama and pull the required LLMs:
``` bash
docker run -p 11434:11434 --name OllamaWebAI ollama/ollama:latest

docker exec -it OllamaWebAI ollama pull qwen2.5-coder
docker exec -it OllamaWebAI ollama pull unitythemaker/llama3.2-vision-tools
```

2. Start Interface
``` bash
bun run dev
```

3. Visit http://localhost:3000 to start using OllamaWeb