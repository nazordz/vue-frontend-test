<template>
  <q-dialog class="" @before-show="fillForms" ref="dialogRef">
    <q-card class="q-dialog-plugin" v-if="user" style="width: 700px; max-width: 80vw;">
      <q-card-section>
        Form User
      </q-card-section>
      <q-card-section>
        <q-form>
          <q-input v-model="form.first_name" label="Nama Depan" />
          <q-input v-model="form.last_name" label="Nama Belakang" />
          <q-input v-model="form.birth_date" mask="date" label="Tanggal lahir">
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
          <q-input label="Email" type="email" v-model="form.email"></q-input>
          <q-input v-if="!id" label="Password" type="password" v-model="form.password"></q-input>
          <q-option-group inline v-model="form.gender" :options="genderOptions" />
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
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { User } from 'src/pages/Login.vue'
import { defineComponent, PropType, reactive, ref } from 'vue'

interface Form {
  first_name: string
  last_name: string
  gender: string
  birth_date: string
  email: string
  password?: string
}

export default defineComponent({
  props: {
    id: Number,
    user: {
      type: Object as PropType<User>
    }
  },
  emits: [
    ...useDialogPluginComponent.emits
  ],

  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
    const $q = useQuasar()
    const form = reactive({
      first_name: '',
      last_name: '',
      gender: '',
      birth_date: '',
      email: '',
      password: ''
    })
    function fillForms() {
      if (props.user) {
        form.first_name = props.user.first_name
        form.last_name = props.user.last_name
        form.birth_date = props.user.birth_date
        form.gender = props.user.gender
        form.email = props.user.email
      }
    }
    async function save() {
      const params: Form = form
      try {
        if (props.id) {
          delete params.password
          await api.put(`users/${props.id}`, form)
        } else {
          await api.post('users', form)
        }
        $q.notify({
          message: 'Berhasil disimpan',
          position: 'top',
          color: 'dark'
        })
        onDialogOK()
      } catch (error) {
        $q.notify({
          message: 'Gagal disimpan',
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
      fillForms,
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
