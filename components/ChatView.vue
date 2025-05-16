<template>
    <div class="container">
        <div class="messageContainer">
            <ChatMessage v-for="i in messages">
                {{ i }}
            </ChatMessage>
        </div>
        <div class="inputContainer">
            <input :placeholder="generating ? 'Generating...' : 'Add a prompt...'" ref="input" :disabled="generating" class="promptInput" />
            <label for="fileInput" class="fileInputLabel">
                <Icon name="mdi:send-circle" class="send" />
            </label>
            <input id="fileInput" type="file" @change="onImage" class="fileInput" accept="image/*" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ModelRef } from 'vue';
import generate from '~/utils/GenerateCodeClient';

const messages: Ref<string[]> = ref([]);
const input = ref();
const generating = ref(false);

const contentUrl: ModelRef<string | undefined> = defineModel();

// function onInput() {
//     let text = input.value.value;
//     messages.value.unshift(text);
//     input.value.value = '';
//     generating.value = true;

//     let image = "";

//     generate(image, text)
//     .finally(() => {
//         generating.value = false;
//     });
// }

function onImage(event: any) {
    const file = event.target.files[0];

    console.log(file);

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = async () => {
        if(reader.result == null || typeof(reader.result) != "string") {
            console.error("Couldn't load image!");
            return;
        }
        const image = reader.result.split(',')[1];

        const prompt = input.value.value.length > 0 ? input.value.value : undefined;
        if(prompt != undefined) {
            messages.value.unshift(prompt);
        }
        input.value.value = '';
        
        generating.value = true;

        generate(image, prompt)
        .then(res => {
            if(res == undefined) {
                throw new Error('no result');
            }
            console.log(res);

            if(res.error != undefined) {
                throw new Error(res.error);
            }
            contentUrl.value = res.url;
        })
        .catch(e => {
            console.error(e);
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

.messageContainer {
    display: flex;

    height: calc(100% - 90px);

    width: calc(100% - 20px);
    margin: 0 10px;

    border-radius: 20px;

    align-items: end;
    flex-direction: column-reverse;

    background-color: #1e1a20;
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
</style>