<template>
    <div class="container">
        <iframe v-if="contentUrl" :src="contentUrl" ref="frame" />
    </div>
</template>

<script setup lang="ts">
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
    
function refreshFrame() {
    frame.value?.contentWindow?.location.reload();
}
</script>

<style scoped>
.container {
    width: calc(100% - 20px);
    height: calc(100% - 20px);

    margin: 10px;

    text-align: center;
    align-content: center;
}

iframe {
    width: 100%;
    height: 100%;

    border: none;
    border-radius: 20px;

    background-color: white;
}
</style>