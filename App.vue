<template>
    <div class="frame">
        <ChatView v-model="url" :refresh="onRefresh" />
        <OutputView :content-url="url" ref="view" />
    </div>
</template>

<script setup lang="ts">
import OutputView from './components/OutputView.vue';

const url: Ref<string | undefined> = ref(undefined);

const view: Ref<ComponentPublicInstance<typeof OutputView> | undefined> = ref();

function onRefresh() {
    view.value?.refreshFrame();
}
</script>

<style scoped>
.frame {
    display: flex;

    width: 100vw;
    height: 100vh;
}
</style>