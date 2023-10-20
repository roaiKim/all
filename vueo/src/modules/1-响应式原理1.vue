<script setup lang="ts">
    import { reactive, ref } from "vue";
    const count = ref<number>(2);
    const va = reactive({count});
    function increment() {
        count.value = count.value + count.value;
    }
    const dyid = ref("123");

</script>

<!-- <script lang="ts">
import { ref } from "vue";
export default {
    setup(){
        const count = ref(2);
        function increment() {
            count.value = count.value + count.value;
        }
        return {
            count,
            increment
        }
    }
}
</script> -->


<template>
    <button @click="increment">
        {{ count }}
    </button>
    {{ va.count }}
    <!-- 属性绑定和不绑定的区别 如果不绑定 则这个值是静态的 -->
    <input id="dyid" v-model="dyid"/> <!-- 这里id为dyid的字符串 不会变化 -->
    <input :id="dyid" v-model="dyid"/><!-- 这里id为dyid的变量会随着输入的变化而变化 -->
</template>