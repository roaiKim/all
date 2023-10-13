<script setup lang="ts">
/**
 * v-if 是直接不渲染 而 v-show 只是设置 display 不显示
 * v-if 变化的开销大 v-show 则初次渲染的开销大
 * 如果一个元素需要频繁显示隐藏 则用v-show，反之则v-if
 */
    import { reactive, ref, computed } from "vue";
    const bo = [
        {
            name: "r",
            show: true
        },
        {
            name: "o",
            show: true
        },
        {
            name: "s",
            show: true
        },
        {
            name: "e",
            show: true
        },
        {
            name: "n",
            show: true
        },
    ];

    const bost = {
        r: 1,
        o: 2,
        s: 3,
        e: 4,
        n: 5,
    };
    
</script>

<template>
    
    <div>
        数组：<code style="color: red">for in</code>
        <span v-for="(item, index) in bo">{{ item.name }}</span>
    </div>
    <div>
        数组：<code style="color: red">for of</code>
        <span v-for="(item, index) of bo">{{ item.name }}</span>
    </div>
    <div>
        对象：<code style="color: red">for of</code>
        <span v-for="(item, index) in bost">{{ item }}{{ index }}</span>
    </div>
    <div>
        数字：<code style="color: red">for of</code>
        <span v-for="(item, index) in 20">{{ item }}</span>
    </div>
</template>

<style>
.author {
    color: red;
}
.active {
    color: red;
}
</style>