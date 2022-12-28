<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { Row } from "@/types/Row";
import TextRow from "@/components/TextRow.vue"

const rows = ref([] as Row[]);
onMounted(() => {
  let localStorageRows = localStorage.getItem('rows');
  if (localStorageRows) {
    rows.value = JSON.parse(localStorageRows as string) as Row[];
  }
});

watch(
  () => rows,
  rows => {
    if (rows) {
      localStorage.setItem('rows', JSON.stringify(rows.value));
      console.log('settings have changed', rows.value);
    }
  },
  { deep: true },
)

const addRow = () => {
  rows.value = [
    ...rows.value,
    {
      name: '',
      completed: false,
    }
  ]
}

const deleteRow = (index) => {
  rows.value.splice(index, 1);
}

const onChange = (value, row, name) => {
  row[name] = value;
}
const columns = [
  {
    type: 'text',
    name: 'name',
    required: true,
    label: 'name',
    align: 'left',
    sortable: true,
  },
  {
    type: 'checkbox',
    name: 'completed',
    label: 'completed',
    sortable: true
  },
  {
    type: 'action',
    name: 'delete',
    label: '',
    action: deleteRow
  }
];

</script>

<template>
  <div class="app">
    <q-btn color="primary" @click="addRow" icon="add" class="add-button"></q-btn>
    <q-table title="To Do" :rows="rows" :columns="columns" row-key="name" binary-state-sort>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in columns" :key="col.name" :props="props">

            <!-- // text component -->
            <text-row v-if="col.type === 'text'" :text="props.row[col.name]" :isLineThrough="props.row.completed"
              @change="(value) => onChange(value, props.row, col.name)"></text-row>
            <!-- <template v-if="col.type === 'text'"> -->
            <!-- <span :class="{ 'line-through': props.row.completed }">{{ props.row[col.name] }}</span>
              <q-popup-edit v-model="props.row[col.name]" buttons v-slot="scope">
                <q-input v-model="scope.value" autofocus />
              </q-popup-edit> -->

            <!-- </template> -->
            <!-- // checkbox component -->
            <q-checkbox v-else-if="col.type === 'checkbox'" v-model="props.row[col.name]"></q-checkbox>

            <!-- // btn component -->
            <q-btn v-else-if="col.type === 'action'" color="negative" :icon-right="col.name" no-caps flat dense
              @click="col.action(rows.indexOf(props.row))" />

          </q-td>

          <!-- <q-td key="name" :props="props" :class="{'line-through': props.row.completed}">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter />
            </q-popup-edit>
          </q-td> 
          <q-td key="completed" :props="props">
            <q-checkbox v-model="props.row.completed" />
          </q-td>
          <q-td key="delete" :props="props">
            <q-btn color="negative" icon-right="delete" no-caps flat dense
              @click="deleteRow(rows.indexOf(props.row))" />
          </q-td> -->
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap");
@import url("https://fonts.googleapis.com/css?family=Merriweather");

.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 20px;

}
</style>

<style scoped>
.add-button {
  width: 40px;
  height: 40px;
  padding: 0.375rem 1rem 0.3125rem;
  align-self: flex-end;
  color: #fff;
  box-shadow: 0 4px 9px -4px #3b71ca;
  margin-bottom: 20px;
}
</style>

