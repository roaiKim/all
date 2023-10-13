<script setup lang="ts">
/**
 * v-if 是直接不渲染 而 v-show 只是设置 display 不显示
 * v-if 变化的开销大 v-show 则初次渲染的开销大
 * 如果一个元素需要频繁显示隐藏 则用v-show，反之则v-if
 */
    import { reactive, ref, computed } from "vue";
    
    const active = ref(true);
    const toggle = () => {
        active.value = !active.value;
    }
</script>

<template>
    <span v-if="active">show</span>
    <span v-else>hide</span>
    <span v-show="active">v-show</span><!-- 仅仅 dispaly="none" -->


    <button @click="toggle">kkk</button>
    <button @click="active = !active">jjjf</button>
</template>

<style>
.author {
    color: red;
}
.active {
    color: red;
}
</style>