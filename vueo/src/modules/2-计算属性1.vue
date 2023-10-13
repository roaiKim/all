<script setup lang="ts">
    import { reactive, ref, computed } from "vue";
    const author = reactive({
        name: "John Doe",
        books: ["Vue 1", "Vue 2", "Vue 3"]
    });
    const hasMessage = computed(() => {
        return author.books.length ? "是" : "否"
    });
    /**
     * 计算属性 应当是只读的，类似于 react.memo
     */
</script>

<template>
     
    {{  hasMessage }}
</template>