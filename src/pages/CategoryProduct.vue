<template>
  <div class="q-ma-md">
    <div class="row q-my-md q-mx-sm">
      <q-btn @click="showFormAdd" label="Create Category" no-caps color="primary"></q-btn>
    </div>
    <q-table
      ref="mainTable"
      :onRequest="getCategoryProduct"
      :columns="columns"
      :rows="rows"
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn icon="edit" class="q-mr-sm" size="sm" round color="green" @click="clickRow(props.row)"></q-btn>
          <q-btn icon="delete" size="sm" round color="red" @click="deleteRow(props.value)"></q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { date, LooseDictionary, useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { CategoryProduct } from 'src/components/models'
import { defineComponent, defineAsyncComponent, onMounted, ref } from 'vue'
const FormCategoryProduct = defineAsyncComponent(() => import('components/dialogs/FormCategoryProduct.vue'))

const columns = [
  {
    field: 'name',
    label: 'Category Name',
    name: 'name'
  },
  {
    field: 'description',
    label: 'Description',
    name: 'description'
  },
  {
    field: 'created_at',
    label: 'created at',
    name: 'created_at',
    format: (val: string) => date.formatDate(new Date(val), 'DD MMM YYYY')
  },
  {
    field: 'id',
    name: 'action',
    label: 'Action'
  }
]
export default defineComponent({
  name: 'CategoryProduct',
  setup() {
    const mainTable = ref()
    const rows = ref<CategoryProduct[]>([])
    const $q = useQuasar()

    async function getCategoryProduct() {
      const req = await api.get<CategoryProduct[]>('category-products')
      rows.value = req.data
    }
    onMounted(async () => {
      await getCategoryProduct()
    })
    function deleteRow(id: string) {
      $q.dialog({
        title: 'Delete',
        message: 'are you sure?',
        cancel: true,
      }).onOk(async () => {
        await api.delete('category-products', {
          data: { id }
        })
        mainTable.value.requestServerInteraction()
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
    function showFormAdd() {
      $q.dialog({
        component: FormCategoryProduct,
        componentProps: {
          id: null,
          categoryProduct: {}
        }
      }).onOk(() => {
        mainTable.value.requestServerInteraction()
      })
    }
    function clickRow(row: LooseDictionary) {
      $q.dialog({
        component: FormCategoryProduct,
        componentProps: {
          id: row.id,
          categoryProduct: row
        }
      }).onOk(() => {
        mainTable.value.requestServerInteraction()
      })
    }
    return {
      columns,
      rows,
      clickRow,
      mainTable,
      getCategoryProduct,
      showFormAdd,
      deleteRow
    }
  }
})
</script>
<style>

</style>
