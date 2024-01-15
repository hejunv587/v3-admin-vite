<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue"
import {
  // createProductDataApi,
  // deleteProductDataApi,
  // updateProductDataApi,
  getAllProductApi,
  getImageUrlApi
} from "@/api/products/product/index"
import { type GetProductData } from "@/api/products/product/types"
import { ElMessage, FormRules, type FormInstance, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
// import router from "@/router"
import { type ReviewData } from "@/api/products/review/types"
import { createReviewApi, deleteReviewApi, getReviewApi, updateReviewApi } from "@/api/products/review"

defineOptions({
  // 命名当前组件
  name: "产品评价"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const products = ref<GetProductData[]>([])

onMounted(() => {
  getAllProductApi().then((res) => {
    products.value = res.data
  })
})

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  productId: undefined,
  username: "",
  score: undefined,
  content: "",
  images: []
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
const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        createReviewApi(formData)
          .then(() => {
            ElMessage.success("新增成功")
            getReviewData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      } else {
        updateReviewApi(+currentUpdateId.value, formData)
          .then(() => {
            ElMessage.success("修改成功")
            getReviewData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      }
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.productId = undefined
  formData.username = ""
  formData.score = undefined
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
    deleteReviewApi(row.id).then(() => {
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
  formData.productId = row.productId
  formData.username = row.username as string
  formData.score = row.score
  formData.content = row.content as string
  formData.images = row.images
  dialogVisible.value = true
}
//#endregion

//#region 查
const reviewData = ref<ReviewData[]>([])
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
      reviewData.value = res.data.list
      for (const review of reviewData.value) {
        review.productId = review.product?.id as number
        console.log("reviewData", review)
        // 调用异步函数获取URL
        if (review.images?.length > 0) {
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
                  <img :src="image.url" alt="图片" />
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
          <el-select v-model="formData.productId" placeholder="请选择产品" value-key="name">
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
          <div v-for="(image, index) in formData.images" :key="image.id" class="image-item">
            <img :src="image.url" alt="图片" />
            <el-button icon="el-icon-delete" @click="removeImage(index)">删除</el-button>
          </div>
          <el-upload
            action="your-upload-url"
            list-type="picture-card"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
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
</style>
