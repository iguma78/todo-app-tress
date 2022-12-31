
<script setup lang='ts'>
import TextRow from "@/components/TextRow.vue"

interface GenericRowProps {
    items: any,
    item: any,
    itemProps: any,
    columns: any[],
    isSubItem?: boolean
}

const emit = defineEmits(['change', 'addSubItem'])

const onChange = (value: string, row: any, name: string) => {
    emit('change', value, row, name)
}

const addSubItem = () => {
    emit('addSubItem', props.item);
}

const props = defineProps<GenericRowProps>()
</script>

<template >
    <q-td v-for="col in columns" :key="col.name" :props="itemProps"
        :class="{ 'sub-item-background': props.isSubItem, 'item-background': !props.isSubItem }">
        <!-- // text component -->
        <text-row v-if="col.type === 'text'" :text="props.item[col.name]" :isLineThrough="props.item.completed"
            :isSubItem="isSubItem" @change="(value: any) => onChange(value, props.item, col.name)"></text-row>

        <!-- // checkbox component -->
        <q-checkbox v-else-if="col.type === 'checkbox'" :model-value="item[col.name]"
            @update:model-value="(value: any) => onChange(value, props.item, col.name)"></q-checkbox>

        <!-- // btn component -->
        <q-btn v-else-if="col.type === 'action'" color="negative" :icon-right="col.name" no-caps flat dense
            @click="col.action(props.items, props.items.indexOf(props.item))" />


    </q-td>
    <q-td auto-width :class="{ 'sub-item-background': props.isSubItem, 'item-background': !props.isSubItem }">
        <q-btn v-if="!props.isSubItem" size="sm" color="accent" round dense @click="addSubItem" :icon="'add'" />
    </q-td>
</template>

<style scoped>
.item-background {
    background: #e4ebf2;
    color: black;
}

.sub-item-background {
    background: #f3f3f3;
    color: black;
}

.sub-item-checkbox {
    margin-right: 30px;
}

.line-through {
    text-decoration: line-through;
}
</style>