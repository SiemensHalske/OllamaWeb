<template>
    <div class="frame">
        <ChatView v-model="url" />
        <OutputView :content-url="url" />
    </div>
</template>

<script setup lang="ts">
const url: Ref<string | undefined> = ref(undefined);
</script>

<style scoped>
.frame {
    display: flex;

    width: 100vw;
    height: 100vh;
}
</style>