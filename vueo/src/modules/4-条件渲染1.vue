<script setup lang="ts">
/**
 * v-if 是直接不渲染 而 v-show 只是设置 display 不显示
 * v-if 变化的开销大 v-show 则初次渲染的开销大
 * 如果一个元素需要频繁显示隐藏 则用v-show，反之则v-if
 */
    import { reactive, ref, computed } from "vue";
    import ComponentRef from "../components/componentRef.vue"
    const vf = ref(0);
    const active = ref(true);
    const toggle = () => {
        active.value = !active.value;
    }
</script>

<template>
    <Transition>
        <span v-if="active">show</span>
        <span v-else>hide</span>
    </Transition>
    
    <span v-show="active">v-show{{ vf }}</span><!-- 仅仅 dispaly="none" -->

    
    <button @click="toggle">kkk</button>
    <button @click="active = !active">jjjf</button>
    <button @click="vf++">vf</button>
    <ComponentRef v-if="active"></ComponentRef>
</template>

<style>
.author {
    color: red;
}
.active {
    color: red;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>