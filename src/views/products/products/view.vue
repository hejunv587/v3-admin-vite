<template>
  <div class="app-container">
    <el-card v-if="product">
      <div>
        <img
          :src="product.coverImageUrl"
          alt="Product Cover Image"
          style="max-width: 100%; max-height: 300px; object-fit: cover"
        />
        <p><strong>型号:</strong> {{ product.model }}</p>
        <p><strong>系列:</strong> {{ product.serie.name }}</p>
        <!-- Other fields... -->

        <p><strong>产品详情:</strong> {{ product.description }}</p>
        <!-- <p><strong>Overview:</strong> {{ product.overview }}</p> -->

        <p><strong>功能:</strong></p>
        <ul>
          <li v-for="(item, index) in product.functions ? product.functions.split(',') : []" :key="index">
            {{ item }}
          </li>
        </ul>

        <p><strong>技术参数:</strong></p>
        <ul>
          <li
            v-for="(item, index) in product.technical_parameters ? product.technical_parameters.split(',') : []"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>

        <p><strong>优势:</strong></p>
        <ul>
          <li v-for="(item, index) in product.advantages ? product.advantages.split(',') : []" :key="index">
            {{ item }}
          </li>
        </ul>

        <!-- Repeat the above pattern for other fields... -->

        <p><strong>服务:</strong></p>
        <ul>
          <li v-for="(item, index) in product.services ? product.services.split(',') : []" :key="index">{{ item }}</li>
        </ul>

        <p><strong>选择原因:</strong></p>
        <ul>
          <li v-for="(item, index) in product.whychoose ? product.whychoose.split(',') : []" :key="index">
            {{ item }}
          </li>
        </ul>

        <p><strong>注意事项:</strong></p>
        <ul>
          <li v-for="(item, index) in product.note ? product.note.split(',') : []" :key="index">{{ item }}</li>
        </ul>
      </div>
    </el-card>

    <!-- 添加产品图片 -->
    <el-card>
      <!-- 标题 -->
      <div class="clearfix">
        <span><strong>产品图片</strong></span>
      </div>
      <!-- 展示已上传的图片 -->
      <div class="images-container">
        <div v-for="(image, index) in uploadedImages" :key="index" class="image-item">
          <img :src="image.url" class="uploaded-image" />
          <!-- <el-button type="danger" icon="el-icon-delete" class="remove-button" @click="removeImage(index)"> -->
          <el-icon :size="20" class="remove-button" @click="removeImage(index)">
            <Delete />
          </el-icon>
          <!-- </el-button> -->
        </div>
      </div>

      <!-- 打开图片库的按钮 -->
      <el-button type="primary" @click="openImageLibrary">添加图片</el-button>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { getImageUrlApi, getProductApi } from "@/api/products/product"
import { type GetProductData, Upload } from "@/api/products/product/types"
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"

defineOptions({
  // 命名当前组件
  name: "产品查看"
})

type GetProductDataMore = GetProductData & {
  coverImageUrl: string
}

type ProductImage = Upload & {
  url: string
}

const product = ref<GetProductDataMore>()
const loading = ref<boolean>(false)
const route = useRoute() // Vue Router's useRoute hook
const uploadedImages = ref<ProductImage[]>([])

const getProductData = () => {
  const productId = route.query.id as string
  loading.value = true
  getProductApi(productId)
    .then(async (res) => {
      product.value = res.data as GetProductDataMore
      product.value.coverImageUrl = (await getImageUrl(product.value.cover.id)) || ""
      const imagePromises = product.value.images.map(async (image) => {
        return {
          ...image,
          url: await getImageUrl(image.id)
        }
      })
      uploadedImages.value = await Promise.all(imagePromises)
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

// 打开图片库的方法
const openImageLibrary = () => {
  // 实现打开图片库的逻辑
  // 比如使用一个对话框组件来显示可选图片
}

// 移除图片的方法
const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
}

onMounted(() => {
  getProductData()
})
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  margin-bottom: 20px;
}
.images-container {
  display: flex;
  flex-wrap: wrap;
}

.image-item {
  margin: 10px;
  position: relative;
}

.uploaded-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
}

.remove-button {
  position: absolute;
  top: 5px;
  right: 5px;
  color: red; /* 设置图标颜色为红色 */
  cursor: pointer;
  background-color: white; /* 背景色 */
  border-radius: 50%; /* 圆形背景 */
  padding: 5px; /* 内边距 */
}

/* 悬浮在删除图标上时的样式 */
.remove-button:hover {
  color: darkred; /* 悬浮时颜色变深 */
  background-color: #f5f5f5; /* 悬浮时背景颜色变化 */
}
</style>
