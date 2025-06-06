<template>
    <div class="container">
        <iframe v-if="contentUrl" :src="contentUrl" ref="frame" /> <!-- v-if="contentUrl" --->
        <div v-if="contentUrl" class="toolbar">
            <button @click="copy" :disabled="copyState == 'loading'">
                <Icon :name="copyState == 'ready' ? 'mdi:content-copy' : copyState == 'loading' ? 'mdi:autorenew' : copyState == 'done' ? 'mdi:check' : 'mdi:close'" />
            </button>
            <a :href="contentUrl" download>
                <Icon name="mdi:download-outline" />
            </a>
            <button @click="fullscreen">
                <Icon name="mdi:fullscreen" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
const props = defineProps({
    contentUrl: {
        type: String,
        required: false
    }
})
defineExpose({
    refreshFrame
});

const frame: Ref<HTMLIFrameElement | undefined> = ref();

const copyState: Ref<"ready" | "loading" | "done" | "error"> = ref("ready");
    
function refreshFrame() {
    frame.value?.contentWindow?.location.reload();
}

function copy() {
    if(props.contentUrl === undefined) {
        copyState.value = 'error';
        setTimeout(() => {
            copyState.value = 'ready';
        }, 500);
        return;
    }

    copyState.value = 'loading';

    $fetch(props.contentUrl, { responseType: 'text' })
    .then(async res => {
        await navigator.clipboard.writeText(res as string);

        copyState.value = 'done';
        setTimeout(() => {
            copyState.value = 'ready';
        }, 500);
    })
    .catch(e => {
        console.error(e);
        copyState.value = 'error';
        setTimeout(() => {
            copyState.value = 'ready';
        }, 500);
    });
}

function download() {
    console.log("Download");
}

function fullscreen() {
    window.open(props.contentUrl, '_blank');
}
</script>

<style scoped>
.container {
    width: calc(100% - 20px);
    height: calc(100% - 10px);

    margin: 10px 10px 0 10px;

    text-align: center;
}

iframe {
    width: 100%;
    height: calc(100% - 80px);

    border: none;
    border-radius: 20px;

    background-color: white;
}

.toolbar {
    display: flex;
    justify-content: flex-end;

    width: 100%;
    height: 40px;

    margin: 20px 0;
}

button {
    padding: 5px 20px;
    border-radius: 20px;

    margin: 0 8px;

    background-color: #d2c1d9;
    color: #382c3e;
    border: none;

    font: inherit;
    font-size: 30px;
}

a {
    padding: 5px 20px;
    border-radius: 20px;

    margin: 0 8px;

    background-color: #d2c1d9;
    color: #382c3e;
    border: none;

    font: inherit;
    font-size: 30px;
}
</style>