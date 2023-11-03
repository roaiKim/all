<script setup lang="ts">
    import { ref, watch, type VNodeRef, watchEffect, onMounted, type Ref, defineAsyncComponent, onUnmounted } from "vue";
    
    const toggleShow = ref(false);

    const toggleAnimated = (event) => {
        //
        console.log("--=event=--", event);
    }

</script>

<template>
    <div>
        <button @click="toggleShow = true">Toggle</button>

        <Teleport to=".rosen">
            <div v-if="toggleShow" class="modal">
                <p>Hello form the modal!</p>
                <button @click="toggleShow = false">关闭</button>
            </div>
        </Teleport>
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
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>




