<template>
  <div class="app-container">
    <el-card v-if="product">
      <el-form ref="productForm" :model="product" label-width="100px">
        <el-form-item label="型号">
          <el-input v-model="product.model" />
        </el-form-item>

        <el-form-item label="产品名称">
          <el-input v-model="product.name" />
        </el-form-item>

        <el-form-item label="系列">
          <!-- <el-input v-model="product.serie" /> -->
          <el-select v-model="product.serie" placeholder="请选择系列">
            <el-option v-for="serie in series" :key="serie.id" :label="serie.name" :value="serie" />
          </el-select>
        </el-form-item>

        <!-- Other fields... -->
        <!-- <el-form-item label="概述">
          <el-input v-model="product.overview" />
        </el-form-item> -->

        <el-form-item label="描述">
          <el-input v-model="product.description" />
        </el-form-item>

        <!-- <el-form-item label="Functions">
          <div v-for="(func, index) in functions" :key="index">
            <el-input v-model="functions[index]" />
            <el-button @click="removeFunction(index)" type="danger">Remove</el-button>
          </div>
          <el-button @click="addFunction" type="primary">Add Function</el-button>
        </el-form-item> -->

        <el-form-item label="功能">
          <div>
            <div v-for="(func, index) in functions" :key="index" class="function-item">
              <el-input v-model="functions[index]" class="function-input" />
              <el-button @click="removeItem(functions, index)" type="danger" class="remove-button">Remove</el-button>
            </div>
            <div class="add-button-container">
              <el-button @click="addItem(functions)" type="primary">Add Function</el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="技术参数">
          <div>
            <div v-for="(func, index) in technical_parameters" :key="index" class="function-item">
              <el-input v-model="technical_parameters[index]" class="function-input" />
              <el-button @click="removeItem(technical_parameters, index)" type="danger" class="remove-button"
                >Remove</el-button
              >
            </div>
            <div class="add-button-container">
              <el-button @click="addItem(technical_parameters)" type="primary">Add Function</el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="优势">
          <!-- <el-input v-model="advantages" /> -->
          <div>
            <div v-for="(item, index) in advantages" :key="index" class="function-item">
              <el-input v-model="advantages[index]" class="function-input" />
              <el-button @click="removeItem(advantages, index)" type="danger" class="remove-button">Remove</el-button>
            </div>
            <div class="add-button-container">
              <el-button @click="addItem(advantages)" type="primary">Add Function</el-button>
            </div>
          </div>
        </el-form-item>

        <!-- Repeat the above pattern for other fields... -->

        <el-form-item label="服务">
          <!-- <el-input v-model="services" /> -->
          <div>
            <div v-for="(item, index) in services" :key="index" class="function-item">
              <el-input v-model="services[index]" class="function-input" />
              <el-button @click="removeItem(services, index)" type="danger" class="remove-button">Remove</el-button>
            </div>
            <div class="add-button-container">
              <el-button @click="addItem(services)" type="primary">Add Function</el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="选择原因">
          <!-- <el-input v-model="whyChoose" /> -->
          <div>
            <div v-for="(item, index) in whychoose" :key="index" class="function-item">
              <el-input v-model="whychoose[index]" class="function-input" />
              <el-button @click="removeItem(whychoose, index)" type="danger" class="remove-button">Remove</el-button>
            </div>
            <div class="add-button-container">
              <el-button @click="addItem(whychoose)" type="primary">Add Function</el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="注意事项">
          <!-- <el-input v-model="note" /> -->
          <div>
            <div v-for="(item, index) in note" :key="index" class="function-item">
              <el-input v-model="note[index]" class="function-input" />
              <el-button @click="removeItem(note, index)" type="danger" class="remove-button">Remove</el-button>
            </div>
            <div class="add-button-container">
              <el-button @click="addItem(note)" type="primary">Add Function</el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="封面图片">
          <!-- <el-upload action="/your-upload-api" :show-file-list="false" :on-success="handleCoverImageUpload">
            <el-button slot="trigger" type="primary">Upload</el-button>
          </el-upload> -->
          <!-- <el-upload action="#" list-type="picture-card" :auto-upload="false"></el-upload> -->
          <!-- <img
            v-if="product.coverImageUrl"
            :src="product.coverImageUrl"
            alt="Product Cover Image"
            style="max-width: 100%; max-height: 300px; object-fit: cover"
          /> -->
          <!-- <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleCoverImageUpload"
            :before-upload="beforeAvatarUpload"
          > -->
          <!-- <template #file="{ file }"> -->
          <div class="image-container">
            <img
              v-if="product.coverImageUrl"
              :src="product.coverImageUrl"
              alt="Product Cover Image"
              class="product-image"
            />
            <span v-if="product.coverImageUrl" class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click.stop="handlePictureCardPreview(product.coverImageUrl)">
                <el-icon><zoom-in /></el-icon>
              </span>
              <!-- <span class="el-upload-list__item-preview" @click.stop="handlePictureCardPreview(file)">
                  <el-icon><Download /></el-icon>
                </span> -->
              <span class="el-upload-list__item-preview" @click.stop="handleRemove()">
                <el-icon><Delete /></el-icon>
              </span>
            </span>
          </div>
          <!-- </template> -->
          <el-icon @click.stop="handleAddUpload" v-if="!product.coverImageUrl" class="avatar-uploader-icon"
            ><Plus
          /></el-icon>
          <!-- </el-upload> -->
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>

  <!-- 图片预览对话框 -->
  <el-dialog v-model="previewVisible" class="el-dialog">
    <img :src="previewImageUrl" alt="Preview" />
  </el-dialog>

  <el-dialog v-model="dialogUplaod" title="图片管理">
    <!-- 图片列表 -->
    <div class="image-list">
      <div v-for="image in images" :label="image.url" :key="image.id" class="image-box">
        <img
          :src="image.url"
          class="image-preview"
          :class="{ selected: image.selected }"
          @click="toggleSelection(image)"
        />
        <el-icon v-if="image.selected" class="selected-icon"><Check /></el-icon>
      </div>
    </div>
    <div class="button-area">
      <div class="example-pagination-block">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-button type="primary" @click="confirmSelection">确定选择</el-button>
      <el-upload
        class="avatar-uploader"
        :action="uploadUrl"
        :show-file-list="false"
        :on-success="handleCoverImageUpload"
        :before-upload="beforeAvatarUpload"
      >
        <el-button @click="uploadNewAttachment">上传新附件</el-button>
      </el-upload>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  getImageUrlApi,
  getProductApi,
  updateProductDataApi,
  createProductDataApi,
  getUploadAPi
} from "@/api/products/product"
import { getAllCategoryApi } from "@/api/products/category"
import { UpdateProductRequestData, type GetProductData, Upload } from "@/api/products/product/types"
import { ref, onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import { usePagination } from "@/hooks/usePagination"
import { GetCategoryData } from "@/api/products/category/types"

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
// import type { UploadFile } from "element-plus"

defineOptions({
  // 命名当前组件
  name: "编辑产品"
})

type GetProductDataMore = GetProductData & {
  coverImageUrl: string
}

const previewImageUrl = ref("")
const previewVisible = ref(false)

const dialogUplaod = ref(false)

interface ExtendedUploadDataType extends Upload {
  url: string
  selected: boolean
}
const images = ref<ExtendedUploadDataType[]>([])

// const selectedImages = ref([])
// const currentPage = ref(1)
// const pageSize = 10

const product = ref<GetProductDataMore>()
const loading = ref<boolean>(false)
// const disabled = ref(false)
const route = useRoute() // Vue Router's useRoute hook
const uploadUrl = import.meta.env.VITE_BASE_API + "/upload/album1"

const getProductData = () => {
  if (route.query.id) {
    const productId = route.query.id as string
    loading.value = true
    getProductApi(productId)
      .then(async (res) => {
        product.value = res.data as GetProductDataMore
        setFormValues() // Populate form fields
        product.value.coverImageUrl = (await getImageUrl(product.value.cover.id)) || ""
      })
      .catch()
      .finally(() => {
        loading.value = false
      })
  } else {
    initFormValues()
  }
}

const initFormValues = () => {
  product.value = {
    model: "",
    serie: {
      id: "",
      name: ""
    },
    description: "",
    overview: "",
    // functions: "",
    // advantages: "",
    // technical_parameters: "",
    name: ""
    // services: "",
    // whychoose: "",
    // note: ""
  }
}
const setFormValues = () => {
  functions.value = product.value?.functions.split(",") || []
  technical_parameters.value = product.value?.technical_parameters.split(",") || []
  advantages.value = product.value?.advantages.split(",") || []
  services.value = product.value?.services.split(",") || []
  whychoose.value = product.value?.whychoose.split(",") || []
  note.value = product.value?.note.split(",") || []
  // Set values for other fields...
}

// const handleCoverImageUpload = async (response: any, file: any) => {
const handleCoverImageUpload = async (response: any) => {
  if (response.success && product.value) {
    // product.value.coverImageUrl = await getImageUrl(response.data.file.id)
    // product.value.cover = {
    //   id: response.data.file.id
    //   // product: {
    //   //   id: product.value.id
    //   // }
    // }
    //重新加载附件列表
    getUploadData()
  }
}

const getImageUrl = (id: string): Promise<string> => {
  return getImageUrlApi(id).then((res) => {
    const url = res.data
    return url
  })
}

const submitForm = () => {
  const formData: UpdateProductRequestData = {
    model: product.value?.model || "",
    serie: product.value?.serie || null,
    name: product.value?.name || "",
    description: product.value?.description || "",
    overview: product.value?.overview || "",
    // Add other fields...
    functions: functions.value,
    technical_parameters: technical_parameters.value,
    advantages: advantages.value,
    services: services.value,
    whychoose: whychoose.value,
    note: note.value
    // Split values for other fields...
  }
  if (product.value?.cover) formData.cover = product.value?.cover

  if (product.value?.id) {
    formData.id = product.value.id
    updateProductDataApi(formData)
      .then(() => {
        // Handle success, maybe redirect to the viewing page
      })
      .catch((error) => {
        // Handle error
        console.log(error)
      })
  } else {
    createProductDataApi(formData)
      .then(() => {
        // Handle success, maybe redirect to the viewing page
      })
      .catch((error) => {
        // Handle error
        console.log(error)
      })
  }
}

const series = ref<GetCategoryData[]>([])

const getSeries = async () => {
  const res = await getAllCategoryApi()
  series.value = res.data
}

onMounted(() => {
  getProductData()
  getSeries()
})

// Refs for form fields
const functions = ref<string[]>([])
const advantages = ref<string[]>([])
const services = ref<string[]>([])
const whychoose = ref<string[]>([])
const note = ref<string[]>([])
const technical_parameters = ref<string[]>([])
// Add refs for other fields...

// const addFunction = () => {
//   functions.value.push("")
// }

// const removeFunction = (index: number) => {
//   functions.value.splice(index, 1)
// }

const removeItem = (itemList: any[], index: number) => {
  itemList.splice(index, 1)
}

const addItem = (itemList: string[]) => {
  itemList.push("") // 添加一个空值作为新的输入项
}

const handlePictureCardPreview = (url: string) => {
  previewImageUrl.value = url
  previewVisible.value = true
}

const handleRemove = () => {
  // 处理移除图片的操作
  if (product.value) {
    product.value.coverImageUrl = ""
    // product.value.cover = { id: null }
  }
}

const handleAddUpload = () => {
  dialogUplaod.value = !dialogUplaod.value
  getUploadData()
}

//获取附件列表
//#region 查
const uploadData = ref<Upload[]>([])
// const searchFormRef = ref<FormInstance | null>(null)
// const searchData = reactive({
//   model: "",
//   name: ""
// })
const getUploadData = () => {
  loading.value = true
  getUploadAPi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize
  })
    .then(async (res) => {
      paginationData.total = res.data.total

      // 创建一个处理每个元素的 Promise 数组
      const promises = res.data.list.map(async (element: Upload) => {
        const url = await getImageUrl(element.id)
        const selected = false
        return { ...element, url, selected }
      })

      // 等待所有 Promise 完成
      const results = await Promise.all(promises)

      // 更新 uploadData 和 images
      // uploadData.value = results
      images.value = results
    })
    .catch(() => {
      uploadData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

const toggleSelection = (image: ExtendedUploadDataType) => {
  // 对于单选，首先清除所有图片的选中状态
  images.value.forEach((image) => {
    image.selected = false
  })

  // 然后切换当前图片的选中状态
  image.selected = !image.selected
}

const confirmSelection = async () => {
  const selectedImages = images.value.filter((img) => img.selected).map((img) => ({ id: img.id }))
  console.log("选中的图片:", selectedImages)
  // 执行选中图片的操作
  if (product.value) {
    product.value.cover = selectedImages[0]
    product.value.coverImageUrl = (await getImageUrl(product.value.cover.id)) || ""
  }
  // 关闭弹窗
  dialogUplaod.value = false
}

const uploadNewAttachment = () => {
  // 实现上传逻辑
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getUploadData, { immediate: true })
</script>

<style scoped>
.prop-arrarys {
  display: flex;
  flex-direction: row;
}
.function-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.function-input {
  flex: 1;
  margin-right: 10px;
}

.remove-button {
  margin-left: 10px;
}

.add-button-container {
  margin-top: 10px;
}

.image-container {
  position: relative;
  max-width: 100%;
  /* max-height: 300px; */
  display: block; /* 或其他合适的布局方式 */
}

.product-image {
  width: 100%;
  /* height: 100%; */
  max-height: 300px;
  object-fit: cover;
}

.el-upload-list__item-actions {
  position: absolute;
  top: 50%; /* 垂直居中 */
  left: 50%; /* 水平居中 */
  transform: translate(-50%, -50%); /* 使用 transform 确保完全居中 */
  display: flex; /* 使用 flex 布局进行水平排列 */
  align-items: center; /* 确保图标垂直居中 */
  gap: 10px; /* 图标之间的间隔 */
}

.el-upload-list__item-preview {
  display: inline-block; /* 内联块布局，确保水平排列 */
  width: 100px; /* 设置图标宽度为 100px */
  font-size: 20px;
  transform: scale(1.5); /* 将图标缩放 1.5 倍 */
  text-align: center;
  vertical-align: middle; /* 设置垂直居中 */
}

.el-dialog img {
  max-width: 100%;
  max-height: 100%;
  display: block; /* 这可以消除图片下方的白色间隙 */
}

.example-pagination-block + .example-pagination-block {
  margin-top: 10px;
}
.example-pagination-block .example-demonstration {
  margin-bottom: 16px;
}

.image-preview {
  width: 100%; /* 控制图片的宽度 */
  height: 100%; /* 控制图片的高度 */
  object-fit: cover; /* 保持图片的纵横比，多余的部分会被裁剪 */
  cursor: pointer;
}

.el-checkbox {
  width: calc(20% - 10px); /* 每个复选框占据大约 20% 的宽度，减去一些间距 */
  margin: 5px; /* 提供上下左右的间距以避免重叠 */
  display: inline-block; /* 使复选框水平排列 */
}

.image-box {
  /* position: relative;
  display: inline-block;
  margin: 5px; */
  width: calc(20% - 10px); /* 一行五个图片，每个图片占20%，减去间隙 */
  margin: 5px; /* 图片之间的间隙 */
  cursor: pointer;
  position: relative;
}

.selected-icon {
  position: absolute;
  top: 0;
  right: 0;
  color: #409eff;
  font-size: 24px; /* 调整图标大小 */
}

.image-list {
  width: 100%;
  /* height: 60vh; */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around; /* 确保图片均匀分布 */
}

.selected {
  border: 2px solid #409eff; /* 被选中的图片有蓝色边框 */
}

.button-area {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* 在按钮和分页控件之间留出空间 */
  align-items: center; /* 垂直居中 */
}
</style>
