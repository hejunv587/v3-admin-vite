<template>
  <div class="app-container">
    <el-card v-if="product">
      <div>
        <img
          :src="product.coverImageUrl"
          alt="Product Cover Image"
          style="max-width: 100%; max-height: 300px; object-fit: cover"
        />
        <p><strong>Model:</strong> {{ product.model }}</p>
        <p><strong>Serie:</strong> {{ product.serie }}</p>
        <!-- Other fields... -->

        <p><strong>Description:</strong> {{ product.description }}</p>
        <p><strong>Overview:</strong> {{ product.overview }}</p>

        <p><strong>Functions:</strong></p>
        <ul>
          <li v-for="(func, index) in product.functions.split(',')" :key="index">{{ func }}</li>
        </ul>

        <p><strong>Advantages:</strong></p>
        <ul>
          <li v-for="(advantage, index) in product.advantages.split(',')" :key="index">{{ advantage }}</li>
        </ul>

        <!-- Repeat the above pattern for other fields... -->

        <p><strong>Services:</strong></p>
        <ul>
          <li v-for="(service, index) in product.services.split(',')" :key="index">{{ service }}</li>
        </ul>

        <p><strong>Why Choose:</strong></p>
        <ul>
          <li v-for="(reason, index) in product.whychoose.split(',')" :key="index">{{ reason }}</li>
        </ul>

        <p><strong>Note:</strong></p>
        <ul>
          <li v-for="(note, index) in product.note.split(',')" :key="index">{{ note }}</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { getImageUrlApi, getProductApi } from "@/api/products/product"
import { type GetProductData } from "@/api/products/product/types"
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"

defineOptions({
  // 命名当前组件
  name: "产品查看"
})

type GetProductDataMore = GetProductData & {
  coverImageUrl: string
}

const product = ref<GetProductDataMore>()
const loading = ref<boolean>(false)
const route = useRoute() // Vue Router's useRoute hook

const getProductData = () => {
  const productId = route.query.id as string
  loading.value = true
  getProductApi(productId)
    .then(async (res) => {
      product.value = res.data as GetProductDataMore
      product.value.coverImageUrl = (await getImageUrl(product.value.cover.id)) || ""
    })
    .catch()
    .finally(() => {
      loading.value = false
    })
}

const getImageUrl = (id: string): Promise<string> => {
  return getImageUrlApi(id).then((res) => {
    const url = res.data
    return url
  })
}

onMounted(() => {
  getProductData()
})
</script>
