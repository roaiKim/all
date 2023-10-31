<script setup lang="ts">
    import { ref, watch, type VNodeRef, watchEffect, onMounted, type Ref, defineAsyncComponent, onUnmounted } from "vue";
    import { useMouseLocaltion } from "@src/tools/combs";
    // const x = ref(0);
    // const y = ref(0);

    // function updateXY(event: MouseEvent) {
    //     x.value = event.pageX;
    //     y.value = event.pageY;
    // }

    // onMounted(() => {
    //     window.addEventListener("mousemove", updateXY);
    // });

    // onUnmounted(() => {
    //     window.removeEventListener("mousemove", updateXY);
    // });

    const {x, y} = useMouseLocaltion();

</script>

<template>
    <div>
        {{ $translate('greetings.hello') }}
        <br/>
        鼠标的位置: {{ x }} {{ y }}
        <div style="width: 20px;height: 20px;background: gray;position: absolute" :style="{top: (y-10)+'px',left: (x-10)+'px'}"></div>
    </div>
</template>




