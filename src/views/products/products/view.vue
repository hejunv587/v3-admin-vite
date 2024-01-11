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
          <el-icon :size="20" class="remove-button" @click="removeImage(image, index)">
            <Delete />
          </el-icon>
          <!-- </el-button> -->
        </div>
      </div>

      <!-- 打开图片库的按钮 -->
      <el-button type="primary" @click="openImageLibrary">添加图片</el-button>
    </el-card>

    <!-- 产品问答 -->
    <el-card v-if="product">
      <div class="table-wrapper">
        <el-table :data="product.qas">
          <!-- <el-table-column type="selection" width="50" align="center" /> -->
          <el-table-column prop="id" label="问答ID" align="center" />
          <el-table-column prop="q" label="问题" align="center" />
          <el-table-column prop="a" label="回答" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleQAUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleQADelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 新增Q&A -->
      <el-button type="primary" @click="openQADiag">新增Q&A</el-button>
    </el-card>

    <!-- 产品相关 -->
    <el-card v-if="product">
      <div class="table-wrapper">
        <el-table :data="product.about">
          <el-table-column prop="id" label="相关ID" align="center" />
          <el-table-column prop="name" label="相关标题" align="center" />
          <el-table-column prop="desc" label="相关说明" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleAboutUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleAboutDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 新增相关说明 -->
      <el-button type="primary" @click="openAboutDiag">新增相关说明</el-button>
    </el-card>
  </div>

  <el-dialog v-model="dialogUplaod" title="图片管理">
    <UploadComponent :selectedImages="uploadedImages" :multiple="true" @update:selectedImages="handleSelectedImages" />
  </el-dialog>

  <!-- 新增/修改问答 -->
  <el-dialog
    v-model="dialogQAVisible"
    :title="currentUpdateId === undefined ? '新增问答' : '修改问答'"
    @close="resetForm"
    width="60%"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="50px" label-position="left">
      <el-form-item prop="q" label="问题">
        <el-input v-model="formData.q" placeholder="请输入问题" />
      </el-form-item>
      <el-form-item prop="a" label="答案">
        <el-input v-model="formData.a" placeholder="请输入答案" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogQAVisible = false">取消</el-button>
      <el-button type="primary" @click="handleCreate">确认</el-button>
    </template>
  </el-dialog>

  <!-- 新增/修改相关 -->
  <el-dialog
    v-model="dialogAboutVisible"
    :title="currentUpdateId === undefined ? '新增相关' : '修改相关'"
    @close="resetAboutForm"
    width="60%"
  >
    <el-form ref="aboutFormRef" :model="aboutFormData" :rules="aboutFormRules" label-width="50px" label-position="left">
      <el-form-item prop="name" label="标题">
        <el-input v-model="aboutFormData.name" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item prop="desc" label="描述">
        <el-input v-model="aboutFormData.desc" placeholder="请输入描述" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogAboutVisible = false">取消</el-button>
      <el-button type="primary" @click="handleAboutCreate">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  addProductImagesApi,
  createAboutApi,
  createProductQAApi,
  getImageUrlApi,
  getProductApi,
  removeAboutApi,
  removeProductImagesApi,
  removeProductQAApi,
  updateAboutApi,
  updateProductQAApi
} from "@/api/products/product"
import { type GetProductData, Upload, QA, About } from "@/api/products/product/types"
import { onMounted, reactive, ref } from "vue"
import { useRoute } from "vue-router"
// import SearchMenu from "@/components/SearchMenu/index.vue"
import UploadComponent from "@/components/Upload/index.vue"
import { ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus"

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

const dialogUplaod = ref<boolean>(false)

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
  dialogUplaod.value = true
}

// 移除图片的方法
const removeImage = (image: ProductImage, index: number) => {
  const productId = route.query.id as string
  ElMessageBox.confirm(`正在移除产品图片：${image.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    removeProductImagesApi({ id: productId, image: { uploadId: image.id } }).then(() => {
      ElMessage.success("删除成功")
      uploadedImages.value.splice(index, 1)
    })
  })
}

onMounted(() => {
  getProductData()
})

const addProductImages = (id: string, data: string[]) => {
  addProductImagesApi({ id, imageIds: data })
}

const handleSelectedImages = async (selectedImages) => {
  // console.log("父组件中接收到的:", selectedImages)
  // 处理从子组件传递过来的选中的图片
  // selectedImages.forEach((image) => {
  //   uploadedImages.value.push(image)
  // })
  // uploadedImages.value.push(selectedImages)
  // console.log("uploadedImages:", uploadedImages.value)
  // 从 selectedImages 中提取所有的 id
  const imageIds = selectedImages.map((image) => image.id)

  // 调用批量处理接口
  try {
    const productId = route.query.id as string /* 获取产品的 id */

    // 添加新选择的图片到 uploadedImages，同时进行去重
    selectedImages.forEach((selectedImage) => {
      if (!uploadedImages.value.some((image) => image.id === selectedImage.id)) {
        uploadedImages.value.push(selectedImage)
      }
    })

    await addProductImages(productId, imageIds)
    // console.log("批量添加图片成功")
    ElMessage.success("量添加图片成功")

    // 更新 uploadedImages 值
    // uploadedImages.value.push(...selectedImages)
  } catch (error) {
    // console.error("批量添加图片失败:", error)
    ElMessage.success("批量添加图片失败:")
  }

  dialogUplaod.value = false
}

const currentUpdateId = ref<undefined | number>(undefined)

//#region 增
const dialogQAVisible = ref<boolean>(false)
const openQADiag = () => {
  dialogQAVisible.value = true
}
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  q: "",
  a: "",
  productId: ""
})
const formRules: FormRules = reactive({
  q: [{ required: true, trigger: "blur", message: "请输入问题" }],
  a: [{ required: true, trigger: "blur", message: "请输入答案" }]
})
const handleCreate = () => {
  const productId = route.query.id as string
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        formData.productId = productId
        createProductQAApi(formData)
          .then(() => {
            ElMessage.success("新增成功")
            getProductData()
          })
          .finally(() => {
            dialogQAVisible.value = false
          })
      } else {
        updateProductQAApi({
          id: currentUpdateId.value,
          q: formData.q,
          a: formData.a,
          productId: productId
        })
          .then(() => {
            ElMessage.success("修改成功")
            getProductData()
          })
          .finally(() => {
            dialogQAVisible.value = false
          })
      }
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.q = ""
  formData.a = ""
}
//#endregion
//#region 改
const handleQAUpdate = (row: QA) => {
  currentUpdateId.value = row.id
  formData.q = row.q
  formData.a = row.a
  formData.productId = row.productId ? "" : (row.productId as string)
  dialogQAVisible.value = true
}
//#endregion

//#region 删
const handleQADelete = (row: QA) => {
  ElMessageBox.confirm(`正在移除产品问答，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    removeProductQAApi(row.id).then(() => {
      ElMessage.success("删除问答成功")
      getProductData()
    })
  })
}
//#endregion

//#region 新增相关
const dialogAboutVisible = ref<boolean>(false)
const openAboutDiag = () => {
  dialogAboutVisible.value = true
}
const aboutFormRef = ref<FormInstance | null>(null)
const aboutFormData = reactive({
  name: "",
  desc: "",
  productId: ""
})
const aboutFormRules: FormRules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入相关的标题" }],
  desc: [{ required: true, trigger: "blur", message: "请输入相关的描述" }]
})
const handleAboutCreate = () => {
  const productId = route.query.id as string
  aboutFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        aboutFormData.productId = productId
        createAboutApi(aboutFormData)
          .then(() => {
            ElMessage.success("新增成功")
            getProductData()
          })
          .finally(() => {
            dialogAboutVisible.value = false
          })
      } else {
        updateAboutApi({
          id: currentUpdateId.value,
          name: aboutFormData.name,
          desc: aboutFormData.desc,
          productId: productId
        })
          .then(() => {
            ElMessage.success("修改成功")
            getProductData()
          })
          .finally(() => {
            dialogAboutVisible.value = false
          })
      }
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
const resetAboutForm = () => {
  currentUpdateId.value = undefined
  aboutFormData.name = ""
  aboutFormData.desc = ""
}
//#endregion
//#region 相关修改
const handleAboutUpdate = (row: About) => {
  currentUpdateId.value = row.id
  aboutFormData.name = row.name
  aboutFormData.desc = row.desc
  aboutFormData.productId = row.productId ? "" : (row.productId as string)
  dialogAboutVisible.value = true
}
//#endregion

//#region 相关删除
const handleAboutDelete = (row: About) => {
  ElMessageBox.confirm(`正在移除产品相关，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    removeAboutApi(row.id).then(() => {
      ElMessage.success("删除问答成功")
      getProductData()
    })
  })
}
//#endregion
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
