<script setup lang="ts">
    import { ref, watch, type VNodeRef, watchEffect, onMounted, type Ref, defineAsyncComponent, onUnmounted } from "vue";
    
    const toggleShow = ref(true);

    const toggleAnimated = (event) => {
        //
        console.log("--=event=--", event);
    }

</script>

<template>
    <div>
        <button @click="toggleShow = !toggleShow">Toggle</button>

        <!-- <Transition> -->
            <div class="ro-container" :class="{hide: !toggleShow}" @animationend="toggleAnimated">hello</div>
        <!-- </Transition> -->
    </div>
</template>

<style>
.ro-container {
    width: 160px;
    height: 40px;
}
.ro-container.hide  {
    animation: ceshi 2s ease forwards;
}

@keyframes ceshi {
    to {
        opacity: 0;
        transform: translateX(60px);
    }
}

</style>




