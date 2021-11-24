<template>
  <q-dialog class="" @before-show="fillForms" ref="dialogRef">
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw;">
      <q-card-section>
        Form Product
      </q-card-section>
      <q-card-section>
        <q-form>
          <q-select label="Category" :options="categoryOptions" v-model="form.category_product"/>
          <q-input v-model="form.name" label="Name Product" />
          <q-input v-model="form.description" label="Description" />
          <q-input v-model="form.stock" label="Stock" type="number" />
          <q-file v-model="form.image" label="Image" accept=".png, .jpg, .webp, .jpeg, .gif">
            <template v-slot:append>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </q-form>
        <div v-if="previewImage" class="q-mt-sm">
          <div class="text-grey fa-bold">Old Image</div>
          <q-img :src="showImage(previewImage)" width="300px"></q-img>
        </div>
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
import { showImage } from 'src/pages/Product.vue'
import { defineComponent, PropType, reactive, ref, onMounted, computed } from 'vue'
import { CategoryProduct, Product, SelectOption } from '../models'

interface Form {
  name: string
  description: string
  stock: number
  category_product: string | any
  image: null | File
}

export default defineComponent({
  props: {
    id: String,
    product: {
      type: Object as PropType<Product>
    },
    previewImage: String
  },
  emits: [
    ...useDialogPluginComponent.emits
  ],

  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
    const $q = useQuasar()
    const categories = ref<CategoryProduct[]>([])
    const form = reactive<Form>({
      name: '',
      description: '',
      stock: 0,
      category_product: '',
      image: null
    })
    async function getCategories() {
      try {
        const req = await api.get<CategoryProduct[]>('category-products')
        categories.value = req.data
        fillForms()
      } catch (error) {
        console.log(error);
      }
    }
    onMounted(async () => {
      await getCategories()
    })
    const categoryOptions = computed<SelectOption[]>(() => {
      const cts = categories.value.map(cty => ({ value: cty.id, label: cty.name }))
      return cts
    })
    function fillForms() {
      if (props.product) {
        form.name = props.product.name
        form.description = props.product.description
        form.stock = props.product.stock
        if (props.product.category_product_id) {
          form.category_product = {
            value: props.product.category_product.id,
            label: props.product.category_product.name
          }
        }
      }
    }
    async function save() {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('description', form.description)
      formData.append('stock', String(form.stock))
      if (form.image?.name != '') {
        formData.append('image', form.image as unknown as string)
      }
      formData.append('category_product_id', form.category_product['value'])
      try {
        if (props.id) {
          await api.post(`products/${props.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        } else {
          await api.post('products', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
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
      selectedCategory: ref(null),
      categoryOptions,
      fillForms,
      form,
      dialogRef,
      onDialogHide,
      onCancelClick: onDialogCancel,
      save,
      showImage
    }
  }
})
</script>


<style>

</style>
