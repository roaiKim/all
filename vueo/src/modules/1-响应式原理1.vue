<script setup lang="ts">
    import { reactive, ref } from "vue";
    const count = ref<number>(2);
    const va = reactive({count});
    function increment() {
        count.value = count.value + count.value;
    }
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
</template>