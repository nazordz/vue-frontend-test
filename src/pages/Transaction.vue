<template>
  <div class="q-ma-md">
    <div class="row q-my-md q-mx-sm">
      <q-btn @click="showFormAdd" label="Create Transaction" no-caps color="primary"></q-btn>
    </div>
    <q-table
      ref="mainTable"
      :onRequest="getTransactions"
      :columns="columns"
      :rows="rows"
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn round color="green" size="sm" icon="info" @click="preview(props.value)"></q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { date, useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { defineComponent, defineAsyncComponent, onMounted, ref } from 'vue'
import { Transaction, User } from 'src/components/models'
const FormTransaction = defineAsyncComponent(() => import('components/dialogs/FormTransaction.vue'))
const PreviewTransaction = defineAsyncComponent(() => import('components/dialogs/PreviewTransaction.vue'))

const columns = [
  {
    field: 'user',
    label: 'User',
    name: 'user',
    format: (row: User) => row.first_name,
    align: 'left'
  },
  {
    field: 'type',
    label: 'type',
    name: 'type',
    align: 'left'
  },
  {
    field: 'created_at',
    label: 'created at',
    name: 'created_at',
    format: (val: string) => date.formatDate(new Date(val), 'DD MMM YYYY'),
    align: 'left'
  },
  {
    field: 'id',
    name: 'action',
    label: 'Preview',
    align: 'left'
  }
]
export default defineComponent({
  name: 'Transaction',
  setup() {
    const mainTable = ref()
    const rows = ref<Transaction[]>([])
    const $q = useQuasar()

    async function getTransactions() {
      const req = await api.get<Transaction[]>('transactions')
      rows.value = req.data
    }
    onMounted(async () => {
      await getTransactions()
    })
    function deleteRow(id: string) {
      $q.dialog({
        title: 'Delete',
        message: 'are you sure?',
        cancel: true,
      }).onOk(async () => {
        await api.delete('transactions', {
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
        component: FormTransaction,
      }).onOk(() => {
        mainTable.value.requestServerInteraction()
      })
    }
    function preview(id: string) {
      $q.dialog({
        component: PreviewTransaction,
        componentProps: { id }
      })
    }
    return {
      preview,
      columns,
      rows,
      mainTable,
      getTransactions,
      showFormAdd,
      deleteRow,
    }
  }
})
</script>
<style>

</style>
