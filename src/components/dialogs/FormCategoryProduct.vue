<template>
  <q-dialog class="" @before-show="fillForms" ref="dialogRef">
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw;">
      <q-card-section>
        Form Category Product
      </q-card-section>
      <q-card-section>
        <q-form>
          <q-input v-model="form.name" label="Category Name" />
          <q-input v-model="form.description" label="Description" />
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
import { CategoryProduct } from 'src/components/models'
import { defineComponent, PropType, reactive } from 'vue'

export default defineComponent({
  props: {
    id: Number,
    categoryProduct: {
      type: Object as PropType<CategoryProduct>
    }
  },
  emits: [
    ...useDialogPluginComponent.emits
  ],

  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
    const $q = useQuasar()
    const form = reactive({
      name: '',
      description: '',
    })
    function fillForms() {
      if (props.categoryProduct) {
        form.name = props.categoryProduct.name
        form.description = props.categoryProduct.description
      }
    }
    async function save() {
      try {
        if (props.id) {
          await api.put(`category-products/${props.id}`, form)
        } else {
          await api.post('category-products', form)
        }
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

    return {
      fillForms,
      form,
      dialogRef,
      onDialogHide,
      onCancelClick: onDialogCancel,
      save,
    }
  }
})
</script>


<style>

</style>
