<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

type Row = {
  name: string,
  completed: boolean,
}

const columns = ref([
  {
    name: 'name',
    required: true,
    label: 'name',
    align: 'left',
    sortable: true
  },
  {
    name: 'completed',
    label: 'completed',
    sortable: true

  },
  {
    name: 'delete',
    label: '',
  }
]);

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
  rows.value = [...rows.value, {
    name: '',
    completed: false,
  }
  ]
}

const deleteRow = (index) => {
  rows.value.splice(index, 1);
}


</script>

<template>
  <div class="app">
    <q-btn color="primary" @click="addRow" icon="add" class="add-button"></q-btn>
    <q-table title="To Do" :rows="rows" :columns="columns" row-key="name" binary-state-sort>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props" :class="{'line-through': props.row.completed}">
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
          </q-td>
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

.line-through{
  text-decoration: line-through;
}
</style>

