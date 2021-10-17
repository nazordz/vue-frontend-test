<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Warehouse App
        </q-toolbar-title>

        <q-btn-dropdown v-model="accountDropdown" flat icon="person">
          <q-list>
            <q-item clickable @click="dialogProfile">
              <q-item-section>
                <q-item-label>My Account</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="logout">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list bordered separator>
        <q-item-label header>Menu</q-item-label>
        <q-separator spaced />
        <q-item clickable v-ripple to="/users">
          Users
        </q-item>
        <q-item clickable v-ripple to="/category-products">
          Category Products
        </q-item>
        <q-item clickable v-ripple to="/products">
          Products
        </q-item>
        <q-item clickable v-ripple to="/transactions">
          Transactions
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { defineComponent, ref, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
const FormProfile = defineAsyncComponent(() => import('src/components/dialogs/FormProfile.vue'))

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const leftDrawerOpen = ref(false)
    const accountDropdown = ref(false)
    const $q = useQuasar()
    const router = useRouter()
    const dialogProfile = () => {
      $q.dialog({
        component: FormProfile
      })
    }

    async function logout() {
      try {
        await api.post('/user-logout')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        $q.notify({
          message: 'Logout Success',
          position: 'top',
          color: 'dark'
        })
        await router.replace('/login')
      } catch (error) {
        $q.notify({
          message: 'Logout failed',
          position: 'top',
          color: 'dark'
        })
      }
    }

    return {
      dialogProfile,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      accountDropdown,
      logout
    }
  }
})
</script>
