<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue"
import {
  // createProductDataApi,
  // deleteProductDataApi,
  // updateProductDataApi,
  getAllProductApi
} from "@/api/products/product/index"
import { type GetProductData } from "@/api/products/product/types"
import { ElMessage, FormRules, type FormInstance } from "element-plus"
// import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import router from "@/router"
import { type ReviewData } from "@/api/products/review/types"

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
  productId: "",
  username: "",
  score: "",
  comments: "",
  images: []
})
const formRules: FormRules = reactive({
  productId: [{ required: true, trigger: "blur", message: "请选择评价产品" }],
  username: [{ required: true, trigger: "blur", message: "请输入评价用户名" }],
  score: [{ required: true, trigger: "blur", message: "请输入评价分数" }],
  comments: [{ required: true, trigger: "blur", message: "请输入评价内容" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        // createRevieApi(formData)
        //   .then(() => {
        //     ElMessage.success("新增成功")
        //     getReviewData()
        //   })
        //   .finally(() => {
        //     dialogVisible.value = false
        //   })
      } else {
        updateReviewApi({
          id: currentUpdateId.value,
          name: formData.name
        })
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
  formData.name = ""
}
//#endregion

//#region 删
// const handleDelete = (row: GetProductData) => {
//   ElMessageBox.confirm(`正在删除产品分类：${row.name}，确认删除？`, "提示", {
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//     type: "warning"
//   }).then(() => {
//     deleteProductDataApi(row.id).then(() => {
//       ElMessage.success("删除成功")
//       getProductData()
//     })
//   })
// }
//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: GetProductData) => {
  router.push({ path: "/products/productedit", query: { id: row.id } })
  //   currentUpdateId.value = row.id
  //   formData.name = row.name
  //   dialogVisible.value = true
}
//#endregion

const handleView = (row: GetProductData) => {
  router.push({ path: "/products/productview", query: { id: row.id } })
  // {
  //   path: "category",
  //     component: () => import("@/views/products/category/index.vue"),
  //       name: "产品分类",
  //         meta: {
  //     title: "产品分类",
  //       keepAlive: true
  //   }
  // },
}

//#region 查
const reviewData = ref<ReviewData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  id: "",
  model: "",
  name: ""
})
const getProductData = () => {
  loading.value = true
  getReviewApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    name: searchData.id || undefined
  })
    .then((res) => {
      paginationData.total = res.data.total
      productData.value = res.data.list
    })
    .catch(() => {
      productData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getProductData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getProductData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="name" label="产品编码">
          <el-input v-model="searchData.model" placeholder="请输入" />
        </el-form-item>
        <!-- <el-form-item prop="name" label="产品名称">
          <el-input v-model="searchData.name" placeholder="请输入" />
        </el-form-item> -->
        <el-form-item>
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
            <el-button type="primary" :icon="RefreshRight" circle @click="getProductData" />
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
          <el-table-column prop="comments" label="评论内容" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleView(scope.row)">查看</el-button>
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
          <el-select v-model="reviewData.product" placeholder="请选择产品" value-key="name">
            <el-option v-for="product in products" :key="product.id" :label="product.model" :value="product" />
          </el-select>
        </el-form-item>
        <el-form-item prop="name" label="分类">
          <el-input v-model="formData.name" placeholder="请输入" />
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
