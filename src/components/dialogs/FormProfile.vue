<template>
  <q-dialog class="" @before-show="getUser" ref="dialogRef">
    <q-card class="q-dialog-plugin" v-if="id" style="width: 700px; max-width: 80vw;">
      <q-card-section>
        Form User
      </q-card-section>
      <q-card-section>
        <q-form>
          <q-input v-model="form.first_name" label="First Name" />
          <q-input v-model="form.last_name" label="Last Name" />
          <q-input v-model="form.birth_date" mask="date" label="Date Birth">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="form.birth_date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <div class="q-py-sm rounded-borders">
            <span class="text-grey-7">Gender:</span>
            <q-option-group inline v-model="form.gender" :options="genderOptions" />
          </div>
          <q-input label="Email" type="email" v-model="form.email"></q-input>
          <q-checkbox label="Change password?" v-model="form.changePassword"></q-checkbox>
          <q-input v-if="form.changePassword" label="New Password" type="password" v-model="form.password"></q-input>
        </q-form>
      </q-card-section>
      <!-- buttons example -->
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
import { User } from 'src/components/models'
import { defineComponent, reactive, ref } from 'vue'

interface Form {
  first_name: string
  last_name: string
  gender: string
  birth_date: string
  email: string
  changePassword: boolean
  password?: string
}

export default defineComponent({
  emits: [
    ...useDialogPluginComponent.emits
  ],

  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
    const $q = useQuasar()
    const id = ref('')
    const form = reactive({
      first_name: '',
      last_name: '',
      gender: '',
      birth_date: '',
      email: '',
      changePassword: false,
      password: ''
    })
    async function getUser() {
      const { data: userLocal } = await api.get<User>('/user')
      if (userLocal) {
        id.value = userLocal.id
        form.first_name = userLocal.first_name
        form.last_name = userLocal.last_name
        form.birth_date = userLocal.birth_date
        form.gender = userLocal.gender
        form.email = userLocal.email
      }
    }
    async function save() {
      const params = <Form> form
      try {
        if (!form.changePassword) {
          delete params.password
        }
        await api.post(`/user/${id.value}`, params)
        $q.notify({
          message: 'Save Successed',
          position: 'top',
          color: 'dark'
        })
        onDialogOK()
      } catch (error) {
        $q.notify({
          message: 'Save Failed',
          position: 'top',
          color: 'dark'
        })
      }
    }

    const genderOptions = ref([
      { value: 'MAN', label: 'Pria' },
      { value: 'WOMAN', label: 'Wanita' },
    ])

    return {
      id,
      getUser,
      form,
      dialogRef,
      onDialogHide,
      onCancelClick: onDialogCancel,
      save,
      genderOptions
    }
  }
})
</script>
<style>

</style>
