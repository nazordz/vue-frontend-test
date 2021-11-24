<template>
  <q-dialog class="" ref="dialogRef">
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw;">
      <q-card-section>
        Form Transaction
      </q-card-section>
      <q-card-section v-if="products.length">
        <q-form>
          <div class="q-py-sm rounded-borders">
            <span class="text-grey-7">Type Transaction:</span>
            <q-option-group inline v-model="form.type" :options="typeOptions" />
          </div>
          <q-table
            :columns="columns"
            :rows="selectedProducts"
            hide-bottom
          >
            <template v-slot:body-cell-stock="props">
              <q-td :props="props">
                {{ props.row.stock }}
                <q-popup-edit
                  v-model.number="props.row.stock"
                  title="Update stock"
                  label-set="Save"
                  label-cancel="Close"
                  buttons
                  :validate="(val) => limitStock(val, props.row)"
                  @hide="(val) => limitStock(val, props.row)"
                  v-slot="scope">
                  <q-input
                    type="number"
                    :hint="form.type == 'OUT' ? 'Cannot higher than stock product it self' : ''"
                    v-model="scope.value"
                    @keyup.enter="scope.set"
                    :error="!limitStock(scope.value, props.row)"
                    :error-message="!limitStock(scope.value, props.row) ? 'Higher than stock' : ''"
                    dense
                    autofocus
                  />
                </q-popup-edit>
              </q-td>
            </template>
          </q-table>
          <div class="q-mt-md row">
            <div class="col-4">
              <q-select
                label="Choose product to add"
                option-value="id"
                option-label="name"
                v-model="choosenProduct"
                :options="products">
              </q-select>
            </div>
            <q-btn icon="add" @click="addToList" :disable="choosenProduct == undefined" label="Add product" no-caps color="orange"></q-btn>
          </div>
        </q-form>

      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="SAVE" @click="save" />
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { CategoryProduct, Product } from '../models'

export const typeOptions = [
  { value: 'IN', label: 'In' },
  { value: 'OUT', label: 'Out' },
]
const columns = [
  {
    field: 'category_product',
    name: 'category_product',
    label: 'Category',
    align: 'left',
    format: (row: CategoryProduct) => row.name
  },
  {
    field: 'name',
    name: 'name',
    label: 'Name',
    align: 'left'
  },
  {
    field: 'stock',
    name: 'stock',
    label: 'Stock'
  }
]

export default defineComponent({
  name: 'FormTransaction',
  emits: [
    ...useDialogPluginComponent.emits
  ],
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
    const $q = useQuasar()
    const products = ref<Product[]>([])
    const selectedProducts = ref<Product[]>([])
    const choosenProduct = ref()
    const form = reactive({
      type: '',
      products: [
        { product_id: '', stock: 0 }
      ]
    })
    // const transactionData = ref<Transaction>()
    onMounted(async () => {
      await getProducts()
    })
    async function getProducts() {
      const { data } = await api.get<Product[]>('products')
      products.value = data
    }
    // async function getTransaction() {
    //   if (props.id) {
    //     const { data } = await api.get<Transaction>(`transaction/${props.id}`)
    //     transactionData.value = data
    //   }
    //   console.log('save');
    // }
    async function save() {
      try {
        const newSelectedProducts: Product[] = JSON.parse(JSON.stringify(selectedProducts.value))
        form.products = newSelectedProducts.map(n => ({ product_id: n.id, stock: n.stock }))
        await api.post('/transaction', form)
        $q.notify({
          message: 'Success',
          position: 'top',
          color: 'dark'
        })
        form.type = ''
        form.products = [
          { product_id: '', stock: 0 }
        ]
        onDialogOK()
      } catch (error) {
        $q.notify({
          message: 'Failed, check your data',
          position: 'top',
          color: 'dark'
        })
      }
    }

    function addToList() {
      const newSelect: Product = JSON.parse(JSON.stringify(choosenProduct.value))
      newSelect.stock = 0
      selectedProducts.value.push(newSelect)
      choosenProduct.value = undefined
    }


    function limitStock (val: number, row: Product) {
      if (form.type == 'OUT') {
        let rowStock = Number(products.value.find(p => p.id == row.id)?.stock)
        return val <= rowStock
      }
      return true
    }

    return {
      limitStock,
      products,
      choosenProduct,
      columns,
      selectedProducts,
      typeOptions,
      dialogRef,
      onDialogHide,
      onCancelClick: onDialogCancel,
      save,
      form,
      addToList
    }
  }
})
</script>
