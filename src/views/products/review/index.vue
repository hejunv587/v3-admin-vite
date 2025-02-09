<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue"
import {
  // createProductDataApi,
  // deleteProductDataApi,
  // updateProductDataApi,
  getAllProductApi,
  getImageUrlApi
} from "@/api/products/product/index"
import { Upload, type GetProductData } from "@/api/products/product/types"
import { ElMessage, FormRules, type FormInstance, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
// import router from "@/router"
import { newReviewData, type ReviewData } from "@/api/products/review/types"
import { createReviewApi, deleteReviewApi, getReviewApi, updateReviewApi } from "@/api/products/review"
import UploadComponent from "@/components/Upload/index.vue"

defineOptions({
  // 命名当前组件
  name: "产品评价"
})

type ProductImage = Upload & {
  url: string
}

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const products = ref<GetProductData[]>([])

const dialogUplaod = ref<boolean>(false)

// const uploadedImages = ref<ProductImage[]>([])

onMounted(() => {
  getAllProductApi().then((res) => {
    products.value = res.data
  })
})

const selectProductId = computed({
  get: () => formData.productId ?? undefined,
  set: (val) => {
    formData.productId = val as number
  }
})

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  productId: null as number | null,
  username: "",
  score: null as number | null,
  content: "",
  images: [] as ProductImage[]
})
const formRules: FormRules = reactive({
  productId: [{ required: true, trigger: "blur", message: "请选择评价产品" }],
  username: [{ required: true, trigger: "blur", message: "请输入评价用户名" }],
  score: [
    {
      required: true,
      trigger: "blur",
      // message: "请输入评价分数,评分必须在 0 到 5 之间",
      validator: (rule: any, value: any, callback: any) => {
        const numericValue = Number(value) // 将字符串转换为数字
        if (isNaN(numericValue)) {
          // 检查转换结果是否为数字
          callback(new Error("请输入评分"))
        } else if (numericValue < 0 || numericValue > 5) {
          callback(new Error("评分必须在 0 到 5 之间"))
        } else {
          callback()
        }
      }
    }
  ],
  content: [{ required: true, trigger: "blur", message: "请输入评价内容" }]
})

const handleCancle = () => {
  dialogVisible.value = false
  resetForm()
}

const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      const requestData = {
        username: formData.username,
        score: formData.score ?? 5,
        content: formData.content,
        productId: formData.productId ?? 0,
        images: formData.images
      }
      if (currentUpdateId.value === undefined) {
        createReviewApi(requestData)
          .then(() => {
            ElMessage.success("新增成功")
            getReviewData()
          })
          .finally(() => {
            dialogVisible.value = false
            resetForm()
          })
      } else {
        updateReviewApi(+currentUpdateId.value, requestData)
          .then(() => {
            ElMessage.success("修改成功")
            getReviewData()
          })
          .finally(() => {
            dialogVisible.value = false
            resetForm()
          })
      }
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.productId = null
  formData.username = ""
  formData.score = null
  formData.content = ""
  formData.images = []
}
//#endregion

//#region 删
const handleDelete = (row: ReviewData) => {
  ElMessageBox.confirm(`正在删除产品评价：${row.id}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteReviewApi(row.id as number).then(() => {
      ElMessage.success("删除成功")
      getReviewData()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | number>(undefined)
const handleUpdate = (row: ReviewData) => {
  currentUpdateId.value = row.id as number
  formData.productId = row.productId ?? null
  formData.username = row.username as string
  formData.score = row.score ?? null
  formData.content = row.content as string
  formData.images = row.images as ProductImage[]
  dialogVisible.value = true
}
//#endregion

//#region 查
const reviewData = ref<newReviewData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  productId: ""
})
const getReviewData = () => {
  loading.value = true
  getReviewApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    productId: searchData.productId
  })
    .then(async (res) => {
      paginationData.total = res.data.total
      reviewData.value = res.data.list as newReviewData[]
      for (const review of reviewData.value) {
        review.productId = review.product?.id as number
        // 调用异步函数获取URL
        if (review.images && review.images.length > 0) {
          for (const image of review.images) {
            console.log("image", image)
            image.url = await getImageUrl(image.id)
          }
        }
      }
    })
    .catch(() => {
      reviewData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getReviewData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  // searchFormRef.value?.resetFields()
  searchData.productId = ""
  handleSearch()
}
//#endregion

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
const removeImage = (image: ProductImage) => {
  // const productId = route.query.id as string
  ElMessageBox.confirm(`正在移除产品图片：${image.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    // removeProductImagesApi({ id: productId, image: { uploadId: image.id } }).then(() => {
    ElMessage.success("删除成功")
    formData.images = formData.images.filter((item) => item !== image)
    // })
  })
}

const handleSelectedImages = async (selectedImages: any[]) => {
  // const imageIds = selectedImages.map((image) => image.id)

  // 调用批量处理接口
  // try {
  // const productId = route.query.id as string /* 获取产品的 id */

  // 添加新选择的图片到 uploadedImages，同时进行去重
  selectedImages.forEach(async (selectedImage) => {
    if (!formData.images.some((image) => image.id === selectedImage.id)) {
      selectedImage.url = await getImageUrl(selectedImage.id)
      formData.images.push(selectedImage)
    }
  })

  // await addProductImages(productId, imageIds)
  // console.log("批量添加图片成功")
  // ElMessage.success("量添加图片成功")

  // 更新 uploadedImages 值
  // uploadedImages.value.push(...selectedImages)
  // } catch (error) {
  // console.error("批量添加图片失败:", error)
  // ElMessage.success("批量添加图片失败:")
  // }

  dialogUplaod.value = false
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getReviewData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item>
          <el-select v-model="searchData.productId" placeholder="请选择产品" value-key="name">
            <el-option v-for="product in products" :key="product.id" :label="product.model" :value="product.id" />
          </el-select>
          <!-- <el-form-item prop="name" label="产品名称">
          <el-input v-model="searchData.name" placeholder="请输入" />
        </el-form-item> -->

          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增评论</el-button>
          <!-- <el-button type="danger" :icon="Delete">批量删除</el-button> -->
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getReviewData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="reviewData">
          <!-- <el-table-column type="selection" width="50" align="center" /> -->
          <el-table-column prop="id" label="评论ID" align="center" />
          <el-table-column prop="product.model" label="产品编码" align="center" />
          <el-table-column prop="username" label="用户名称" align="center" />
          <el-table-column prop="score" label="评分" align="center" />
          <el-table-column prop="content" label="评论内容" align="center" />
          <el-table-column prop="images" label="评论图片" align="center">
            <template #default="scope">
              <el-carousel :interval="4000" arrow="always">
                <el-carousel-item v-for="image in scope.row.images" :key="image.id">
                  <img :src="image.url" alt="图片" class="table-image" />
                </el-carousel-item>
              </el-carousel>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
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
    </el-card>

    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增评论' : '修改评论'"
      @close="resetForm"
      width="60%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="username" label="分类">
          <el-select v-model="selectProductId" placeholder="请选择产品" value-key="name">
            <el-option v-for="product in products" :key="product.id" :label="product.model" :value="product.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="username" label="用户名称">
          <el-input v-model="formData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="score" label="评分">
          <el-input v-model="formData.score" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="content" label="评论">
          <el-input v-model="formData.content" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="图片">
          <div class="images-container">
            <div v-for="(image, index) in formData.images" :key="index" class="image-item">
              <img :src="image.url" class="uploaded-image" />
              <!-- <el-button type="danger" icon="el-icon-delete" class="remove-button" @click="removeImage(index)"> -->
              <el-icon :size="20" class="remove-button" @click="removeImage(image)">
                <Delete />
              </el-icon>
              <!-- </el-button> -->
            </div>
          </div>
          <!-- 打开图片库的按钮 -->
          <el-button type="primary" @click="openImageLibrary">添加图片</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCancle">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogUplaod" title="图片管理">
      <UploadComponent
        :key="currentUpdateId || 0"
        :selectedImages="formData.images"
        :multiple="true"
        @update:selectedImages="handleSelectedImages"
      />
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}

.images-container {
  display: flex;
  flex-wrap: wrap;
}

.image-item {
  margin: 10px;
  position: relative;
}

.table-image {
  width: auto;
  height: 100%;
  object-fit: cover;
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
