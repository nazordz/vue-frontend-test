<template>
  <div class="q-ma-md">
    <div class="row q-my-md q-mx-sm">
      <q-btn @click="showFormAdd" label="Create user" no-caps color="primary"></q-btn>
    </div>
    <q-table
      ref="mainTable"
      :onRequest="getUsers"
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
import { defineComponent, defineAsyncComponent, onMounted, ref } from 'vue'
import { User } from './Login.vue'
const FormUser = defineAsyncComponent(() => import('components/dialogs/FormUser.vue'))

export enum gender {
  MAN = 'MAN',
  WOMAN = 'WOMAN'
}

const columns = [
  {
    field: 'first_name',
    label: 'Nama Depan',
    name: 'firstName'
  },
  {
    field: 'last_name',
    label: 'Nama Belakang',
    name: 'lastName'
  },
  {
    field: 'email',
    label: 'Email',
    name: 'email'
  },
  {
    field: 'email',
    label: 'Email',
    name: 'email'
  },
  {
    field: 'gender',
    label: 'Jenis Kelamin',
    name: 'gender',
    format: (g: string) => g == gender.MAN ? 'Pria' : 'Wanita'
  },
  {
    field: 'birth_date',
    label: 'tgl lahir',
    name: 'birth_date',
    format: (val: string) => date.formatDate(new Date(val), 'DD MMM YYYY')
  },
  {
    field: 'created_at',
    label: 'dibuat',
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
  name: 'User',
  setup() {
    const mainTable = ref()
    const rows = ref<User[]>([])
    const $q = useQuasar()
    async function getUsers() {
      const req = await api.get<User[]>('users')
      rows.value = req.data
    }
    onMounted(async () => {
      await getUsers()
    })
    function deleteRow(id: string) {
      $q.dialog({
        title: 'Delete',
        message: 'are you sure?',
        cancel: true,
      }).onOk(async () => {
        await api.delete('users', {
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
        component: FormUser,
        componentProps: {
          id: null,
          user: {}
        }
      }).onOk(() => {
        mainTable.value.requestServerInteraction()
      })
    }
    function clickRow(row: LooseDictionary) {
      $q.dialog({
        component: FormUser,
        componentProps: {
          id: row.id,
          user: row
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
      getUsers,
      showFormAdd,
      deleteRow
    }
  }
})
</script>
<style>

</style>
