<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Login App
        </q-toolbar-title>

        <div>Naufal</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="row justify-center">
        <q-card style="width: 600px;" class="q-my-md q-pa-md">
          <h4>Login</h4>
          <q-form>
              <q-input label="Email" v-model="forms.email"/>
              <q-input label="Password" type="password" v-model="forms.password"/>
              <q-btn @click="login" label="Login" no-caps class="q-mt-md" color="blue"></q-btn>
          </q-form>
        </q-card>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { User } from 'src/components/models';
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router';

interface LoginResponse {
  token: string
  user: User
}

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const $q = useQuasar()
    const router = useRouter()
    const forms = reactive({
      email: '',
      password: ''
    })
    async function login() {
      try {
        const req = await api.post<LoginResponse>('login', {
          email: forms.email,
          password: forms.password
        })
        localStorage.setItem('token', req.data.token)
        localStorage.setItem('user', JSON.stringify(req.data.user))
        $q.notify({
          color: 'dark',
          position: 'top',
          message: 'Logged in'
        })
        await router.replace('/')
      } catch (error) {
        console.log(error);
        $q.notify({
          color: 'dark',
          position: 'top',
          message: 'Login Failed'
        })
      }
    }
    return {
      forms,
      login
    }
  }
})
</script>
