<template>
  <div class="q-ma-md">
    <div class="row q-my-md q-mx-sm">
      <q-btn @click="showFormAdd" label="Create Product" no-caps color="primary"></q-btn>
    </div>
    <q-table
      ref="mainTable"
      :onRequest="getProduct"
      :columns="columns"
      :rows="rows"
    >
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <q-img :src="props.value" width="120px"></q-img>
        </q-td>
      </template>
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
import { CategoryProduct, Product } from 'src/components/models'
import { defineComponent, defineAsyncComponent, onMounted, ref } from 'vue'
const FormProduct = defineAsyncComponent(() => import('components/dialogs/FormProduct.vue'))

export function showImage(img: string): string {
  return `${process.env.BASE_URL || ''}${img}`
}

const columns = [
  {
    field: 'category_product',
    label: 'Category',
    name: 'category',
    format: (row: CategoryProduct) => row.name
  },
  {
    field: 'name',
    label: 'Name',
    name: 'name'
  },
  {
    field: 'description',
    label: 'Description',
    name: 'description'
  },
  {
    field: 'image',
    label: 'Image',
    name: 'image',
    format: (row: string) => showImage(row)
  },
  {
    field: 'stock',
    label: 'Stock',
    name: 'stock',
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
  name: 'Product',
  setup() {
    const mainTable = ref()
    const rows = ref<Product[]>([])
    const $q = useQuasar()

    async function getProduct() {
      const req = await api.get<Product[]>('products')
      rows.value = req.data
    }
    onMounted(async () => {
      await getProduct()
    })
    function deleteRow(id: string) {
      $q.dialog({
        title: 'Delete',
        message: 'are you sure?',
        cancel: true,
      }).onOk(async () => {
        await api.delete('products', {
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
        component: FormProduct,
        componentProps: {
          id: null,
          product: {}
        }
      }).onOk(() => {
        mainTable.value.requestServerInteraction()
      })
    }
    function clickRow(row: LooseDictionary) {
      $q.dialog({
        component: FormProduct,
        componentProps: {
          id: row.id,
          product: row,
          previewImage: row.image
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
      getProduct,
      showFormAdd,
      deleteRow,
    }
  }
})
</script>
<style>

</style>
