<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { Row } from "@/types/Row";
import GenericRow from "@/components/GenericRow.vue"

const rows = ref([] as Row[]);
const filter = ref({ isChecked: false })

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
    }
  },
  { deep: true },
)

const clearCompleted = () => {
  const rowsToDelete: any[] = [];
  const subItemsToDelete: any[] = [];

  rows.value.forEach((row) => {
    if (row.completed) {
      rowsToDelete.push(row);
    }
    row.subItems?.forEach((item) => {
      if (item.completed) {
        subItemsToDelete.push(item);
      }
    });
    subItemsToDelete.forEach(index => {
      deleteRow(row.subItems as Row[], (row.subItems as Row[]).indexOf(index));
    });
  })

  rowsToDelete.forEach(index => {
    deleteRow(rows.value, rows.value.indexOf(index));
  })
}

const addRow = () => {
  rows.value = [
    ...rows.value,
    {
      name: '',
      completed: false,
      subItems: [],
      isVisible: true,
    }
  ]
}

const deleteRow = (items: Row[], index: number) => {
  items.splice(index, 1);
}

const addSubItem = (row: Row) => {
  (row.subItems as Row[]).push(
    {
      name: '',
      completed: false,
      isVisible: true,
    }
  )
}

const onChange = (value: string, row: any, name: string) => {
  row[name] = value;
}

const onFilter = (rows: any[], terms: any) => {
  if (terms.isChecked) {
    rows.forEach((row: any) => {
      row.subItems.forEach((item: any) => {
        item.isVisible = item.completed === terms.isChecked;
      })
      row.isVisible = row.completed === terms.isChecked;
    });
  } else {
    rows.forEach((row: any) => {
      row.subItems.forEach((item: any) => {
        item.isVisible = true;
      })
      row.isVisible = true;
    });
  }
  return rows;
}

const columns: any[] = [
    {
      type: 'text',
      name: 'name',
      required: true,
      label: 'NAME',
      align: 'left',
    },
    {
      type: 'checkbox',
      name: 'completed',
      label: 'COMPLETED',
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
    <div class="buttons">
    <q-btn color="primary" @click="addRow" icon="add" class="button"></q-btn>
    <q-btn color="primary" @click="clearCompleted" icon="delete" class="button"></q-btn>
  </div>
    <q-table title="To Do" :rows="rows" :table-header-class="{ 'table-header': true }" :columns="columns"
      :filter-method="onFilter" :filter="filter" row-key="name" binary-state-sort hide-pagination>
      <template v-slot:top-right>
        <q-checkbox v-model="filter.isChecked" label="Show only completed"></q-checkbox>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <generic-row v-if="props.row.isVisible" :items="rows" :item="props.row" :itemProps="props" :columns="columns"
            @change="onChange" @addSubItem="addSubItem"></generic-row>
        </q-tr>

        <!-- subitems -->
        <q-tr v-for="(item, index) in props.row.subItems" :key="index" :props="props" colspan="100">
          <generic-row v-if="item.isVisible" :items="props.row.subItems" :isSubItem="true" :item="item"
            :itemProps="props" :columns="columns" @change="onChange"></generic-row>
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

.q-table__card {
  background: #005b89 !important;
  color: white !important;
}

.q-table {
  background: #9ab6d3;
  font-size: 15px;
  font-weight: 800;
}
</style>

<style scoped>
.buttons{
  display: flex;;
}

.button {
  width: 40px;
  height: 40px;
  padding: 0.375rem 1rem 0.3125rem;
  align-self: flex-end;
  color: #fff;
  box-shadow: 0 4px 9px -4px #ffffff;
  margin-bottom: 20px;
  margin-left: 20px;
}
</style>

