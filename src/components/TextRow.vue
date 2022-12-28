
<script setup lang='ts'>
import { ref, watch } from 'vue';

interface TextRowProps {
    isLineThrough: boolean
    text: string
}
const emit = defineEmits(['change'])
const value = ref('');

watch(
    () => value,
    value => {
        debugger;
        emit('change', value.value)
    },
    { deep: true },
)
const props = defineProps<TextRowProps>()
</script>

<template >
    <span :class="{ 'line-through': props.isLineThrough }">{{ props.text }}</span>
    <q-popup-edit v-model="value" buttons v-slot="scope">
        <q-input v-model="scope.value" autofocus />
    </q-popup-edit>
</template>

<style scoped>
.line-through {
    text-decoration: line-through;
}
</style>