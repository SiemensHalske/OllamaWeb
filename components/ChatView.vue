<template>
    <div class="container">
        <div class="messagesContainer">
            <ChatMessage v-for="message in messages" :message="message" >
                <div class="messageContent" v-if="!message.image">
                    {{ message.content }}
                </div>
                <img :src="message.content" class="messageImage" v-if="message.image" />
            </ChatMessage>
        </div>
        <div class="inputContainer">
            <input :placeholder="generating ? 'Generating...' : 'Add a prompt...'" ref="input" :disabled="generating" class="promptInput" />
            <label for="fileInput" class="fileInputLabel" v-if="messages.length <= 0">
                <Icon name="mdi:send-circle" class="send" />
            </label>
            <input id="fileInput" type="file" @change="onImage" class="fileInput" accept="image/*" v-if="messages.length <= 0"/>
            <Icon name="mdi:send-circle" class="send sendBtn" @click="onInput" tabindex="0" v-else/>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ModelRef } from 'vue';
import type { ChatMessage } from '~/types/ChatMessage';
import { generate, generateWithImage } from '~/utils/GenerateCodeClient';

const props = defineProps<{
    refresh: () => void
}>();
const contentUrl: ModelRef<string | undefined> = defineModel();

const messages: Ref<ChatMessage[]> = ref([]);
const input = ref();
const generating = ref(false);

function onInput() {
    const text = input.value.value;
    messages.value.unshift({
        content: text,
        image: false,
        user: true
    });
    input.value.value = '';
    generating.value = true;

    const contentParts = contentUrl.value?.split('/');
    if(contentParts != undefined) {
        const id = contentParts[contentParts.length - 1].split('.')[0];

        generate(text, id)
        .then(res => {
            if(res == undefined) {
                throw new Error('no result');
            }
            console.log(res);

            if(res.error != undefined) {
                throw new Error(res.error);
            }
            
            props.refresh();
        })
        .catch(async e => {
            console.error(e);
            console.log(await e.json());
        })
        .finally(() => {
            generating.value = false;
        });
    }
}

function onImage(event: any) {
    const files = (event.target as HTMLInputElement).files;

    if(files == null || files.length <= 0) {
        console.error("No image selected!");
        return;
    }

    const file = files[0];

    console.log(file);

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = async () => {
        if(reader.result == null || typeof(reader.result) != "string") {
            console.error("Couldn't load image!");
            return;
        }

        messages.value.unshift({
            content: reader.result,
            user: true,
            image: true
        });

        const image = reader.result.split(',')[1];

        const prompt = input.value.value.length > 0 ? input.value.value : undefined;
        if(prompt != undefined) {
            messages.value.unshift({
                content: prompt,
                user: true,
                image: false
            });
        }
        input.value.value = '';
        
        generating.value = true;

        generateWithImage(image, prompt)
        .then(res => {
            if(res == undefined) {
                throw new Error('no result');
            }
            console.log(res);

            if(res.error != undefined) {
                throw new Error(res.error);
            }

            if(res.output?.prompt != undefined) {
                messages.value.unshift({
                    content: res.output.prompt,
                    user: false,
                    image: false
                });
            }
            contentUrl.value = res.output?.url;
        })
        .catch(async e => {
            console.error(e);
            console.log(await e.json());
        })
        .finally(() => {
            generating.value = false;
        });
    };
}
</script>

<style scoped>
.container {
    min-width: 200px;
    width: min(750px, 50%);
    height: 100%;

    text-align: center;
    align-content: end;
}

.messagesContainer {
    display: flex;

    height: calc(100% - 90px);

    width: calc(100% - 20px);
    margin: 0 10px;

    border-radius: 20px;

    align-items: end;
    flex-direction: column-reverse;

    background-color: #1e1a20;

    overflow: auto;
}

.messageContent {
    width: 100%;
    height: fit-content;
}

.messageImage {
    max-width: 100%;

    border: inherit;
    border-radius: inherit;
}

.inputContainer {
    display: flex;
    height: 40px;

    width: 100%;
    margin: 20px 0;
}

.promptInput {
    flex: 1;
    height: 100%;
    padding: 0 20px;
    margin-left: 20px;

    border-radius: 20px;

    background-color: #2d282e;

    border: none;
    outline: none;

    font: inherit;
    color: inherit;
}

.promptInput::placeholder {
    color: #cdc3ce;
}

.fileInput {
    display: none;
}

.fileInputLabel {
    height: 100%;
    width: fit-content;
    margin: 0 10px;

    align-content: center;
}

.send {
    font-size: 40px;

    background-color: #dfb8f6;
}

.sendBtn {
    margin: 0 10px;
}
</style>