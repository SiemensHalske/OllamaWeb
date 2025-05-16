<template>
    <div class="messageContainer">
        <div class="messageSpacer" v-if="message.user" />
        <div :class="{text: !message.image, image: message.image, userMessage: message.user, serverMessage: !message.user}">
            <slot />
        </div>
        <div class="messageSpacer" v-if="!message.user" />
    </div>
</template>

<script setup lang="ts">
import { type ChatMessage } from '~/types/ChatMessage';

const props = defineProps<{
    message: ChatMessage
}>();
</script>

<style scoped>
.messageContainer {
    display: flex;

    width: calc(100% - 20px);
    height: fit-content;
    margin: 0 10px 10px 10px;
}

.messageSpacer {
    width: 50px;
}

.text {
    width: 100%;
    height: fit-content;
    
    padding: 20px;

    background-color: #4f4256;
    color: #efdcf5;

    border-radius: 20px;

    text-align: left;
    align-content: center;
}

.image {
    width: 100%;
    height: fit-content;

    background-color: #4f4256;
    color: #efdcf5;

    border-radius: 20px;

    text-align: left;
    align-content: center;
}

.userMessage {
    border-bottom-right-radius: 0;
}

.serverMessage {
    border-bottom-left-radius: 0;
    background-color: #663b3d;
    color: #ffdada;
}
</style>