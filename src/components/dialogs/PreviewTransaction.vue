<template>
  <q-dialog class="" @show="load" ref="dialogRef">
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw;">
      <q-card-section>
        Preview Transaction
      </q-card-section>
      <q-card-section v-if="transaction">
        <div class="col-8">
          <div class="row q-my-sm">
            <div class="col-3">User</div>
            <div class="col-9">: {{ transaction.user?.first_name }}</div>
          </div>
          <div class="row q-my-sm">
            <div class="col-3">Type</div>
            <div class="col-9">: {{ transaction.type }}</div>
          </div>
          <div class="row q-my-sm">
            <div class="col-3">created at</div>
            <div class="col-9">: {{ date.formatDate(new Date(transaction.created_at), 'DD MMM YYYY') }}</div>
          </div>
        </div>
        <q-table
          title="List Product"
          hide-bottom
          :columns="columns"
          :rows="transaction.transaction_products"
        ></q-table>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="Close" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { date, useDialogPluginComponent } from 'quasar'
import { api } from 'src/boot/axios'
import { defineComponent, ref } from 'vue'
import { Product, Transaction } from '../models'

const columns =[
  {
    field: 'product',
    name: 'product',
    label: 'Product',
    align: 'left',
    format: (product: Product) => product.name
  },
  {
    field: 'stock',
    name: 'stock',
    label: 'Stock',
    align: 'left'
  }
]

export default defineComponent({
  name: 'PreviewTransaction',
  emits: [
    ...useDialogPluginComponent.emits
  ],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const transaction = ref<Transaction>()
    const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

    async function getTransaction() {
      const { data } = await api.get<Transaction>(`transaction/${props.id}`)
      transaction.value = data
    }

    const load = async () => {
      await getTransaction()
    }

    return {
      columns,
      load,
      dialogRef,
      onDialogHide,
      onCancelClick: onDialogCancel,
      transaction,
      date
    }
  },
})
</script>
