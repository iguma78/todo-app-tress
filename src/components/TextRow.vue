
<script setup lang='ts'>
import { ref, watch } from 'vue';

interface TextRowProps {
    isLineThrough: boolean
    text: string
    isSubItem?: boolean
}
const emit = defineEmits(['change'])
const value = ref('');

watch(
    () => value,
    value => {
        emit('change', value.value)
    },
    { deep: true },
)
const props = defineProps<TextRowProps>()
</script>

<template >
    <span :class="{ 'line-through': props.isLineThrough, 'item': !props.isSubItem, 'sub-item': props.isSubItem }">
        {{ props.text }}
    </span>
    <q-popup-edit v-model="value" buttons v-slot="scope">
        <q-input v-model="scope.value" autofocus />
    </q-popup-edit>
</template>

<style scoped>
.sub-item {
    margin: 30px;
    font-weight: 400;
}

.item {
    font-size: 20px;
    font-weight: 600;
}

.line-through {
    text-decoration: line-through;
}
</style>