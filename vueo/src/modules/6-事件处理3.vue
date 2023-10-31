<script setup lang="ts">
    import { reactive, ref, computed } from "vue";
    const emit = defineEmits(["update:customerType"]);
    const props = defineProps(["customerType", "customerTypeModifiers"]);

    const customerType = computed({
        get() {
            return props.customerType;
        },
        set(value) {
            emit("update:customerType", value)
        }
    });

    const customerInput = (event: Event) => {
        let value = (<HTMLInputElement>(event.target)).value;
        if (props.customerTypeModifiers.capitalize) {
            value = value.charAt(0).toUpperCase() + value.slice(1);
        }
        emit("update:customerType", value);
    }

</script>

<template>
    <div>
        {{ customerType }} {{ props.customerTypeModifiers }}
        <input v-model="customerType" />
        <br/>
        <input :value="customerType" @input="customerInput" />
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