<script setup lang="ts">
    import { reactive, ref, computed } from "vue";
    const emit = defineEmits(["active-update", "update:modelValue", "update:value1", "update:value2"]);
    const props = defineProps(["modelValue", "value1", "value2"]);

    const parentValue = computed({
        get() {
            return props.modelValue;
        },
        set(value) {
            emit("update:modelValue", value)
        }
    });
    const parentValue1 = computed({
        get() {
            return props.value1;
        },
        set(value) {
            emit("update:value1", value)
        }
    });
    const parentValue2 = computed({
        get() {
            return props.value2;
        },
        set(value) {
            emit("update:value2", value)
        }
    });

</script>

<template>
    <div>
        <button @click="$emit('active-update', 10)">子组件</button>
    </div>
    <br/>
    {{ modelValue }}
    <input :value="modelValue" @input="$emit('update:modelValue', (<HTMLInputElement>$event.target).value || '')"/>
    <input  v-model="parentValue" />
    <br/>
    多个事件绑定 {{ parentValue1 }}
    <input  v-model="parentValue1" /> <br/> 
    {{ parentValue2 }}
    <input  v-model="parentValue2" />
</template>

<style>
.author {
    color: red;
}
.active {
    color: red;
}
</style>