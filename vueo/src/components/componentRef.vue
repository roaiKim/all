<script setup lang="ts">
    import { ref, watch, type VNodeRef, onMounted } from "vue";
    const inputValue = ref("");

    defineExpose({
      inputValue
    });

    onMounted(() => {
      console.log("onMountedss");
    });

</script>


<template>
  <div class="item">
    <br/>
    子组件
    <input v-model="inputValue" /><br/>
  </div>
</template>
