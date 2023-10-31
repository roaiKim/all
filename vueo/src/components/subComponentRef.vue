<script setup lang="ts">
    import { ref, watch, type VNodeRef } from "vue";
    const inputValue = ref("");
    const props = defineProps<{
      parentInputValue?: number | string;
      hasButton?: boolean;
      toSubClick?: () => void;
      // toSubClick2: () => void;
    }>();
    const emit = defineEmits(["toSubClick2"]);
    const subClick = () => {
      // 把方法当做一个属性 可以直接调用 propd
      // 如果当做 监听事件 则不能 
      props.toSubClick?.();
    }

    const subClick2 = () => {
      emit("toSubClick2");
      

      
    }

</script>


<template>
  <div class="item">
    <div v-if="!props.hasButton">
      <br/>
      子组件 {{ props }}
      <input v-model="inputValue" /><br/>
    </div>
    <div v-if="props.hasButton">
      <slot></slot>事件 {{ props }}
      <!-- <button @click="$emit(`toSubClick`)">点击</button> -->
      <button @click="subClick">点击</button><br/>
      <button @click="subClick2">点击+2</button>
    </div>
    
  </div>
</template>
