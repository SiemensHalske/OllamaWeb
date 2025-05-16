<template>
    <div class="message">
        <slot />
    </div>
</template>

<style scoped>
.message {
    width: calc(100% - 60px);
    min-height: 40px;
    height: fit-content;
    margin: 0 10px 10px 10px;
    padding: 0 20px;

    background-color: #4f4256;
    color: #efdcf5;

    border-radius: 20px;

    text-align: left;
    align-content: center;
}
</style>