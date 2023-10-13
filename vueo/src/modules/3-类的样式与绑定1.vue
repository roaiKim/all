<script setup lang="ts">
    import { reactive, ref, computed } from "vue";
    const author = reactive({
        name: "John Doe",
        books: ["Vue 1", "Vue 2", "Vue 3"]
    });
    const hasMessage = computed(() => {
        return !!author.books.length
    });
    const active = ref("active");
    /**
     * {author} === {
     *      author: {
     *          name: true
     *          books: true
     *      }
     * }
     */
</script>

<template>
    <span :class="{author}">{{  hasMessage }}</span><!-- // 这种只看author本身的boolan值,即author作为一个对象的属性 则只看author本身 -->
    <span :class="author">{{  hasMessage }}</span> <!-- // author 作为对象时， 会看其属性的boolean -->
    <span :class="[active]">{{  hasMessage }}</span>
</template>

<style>
.author {
    color: red;
}
.active {
    color: red;
}
</style>