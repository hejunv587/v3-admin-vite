<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import {
  deleteProductDataApi,
  // createProductDataApi,
  // deleteProductDataApi,
  // updateProductDataApi,
  getProductDataApi
} from "@/api/products/product/index"
import { type GetProductData } from "@/api/products/product/types"
import { ElMessage, ElMessageBox, type FormInstance } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import router from "@/router"

defineOptions({
  // 命名当前组件
  name: "产品"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
// const dialogVisible = ref<boolean>(false)
const handleAdd = () => {
  router.push({ path: "/products/productedit" })

  //   currentUpdateId.value = row.id
  //   formData.name = row.name
  //   dialogVisible.value = true
}
// const formRef = ref<FormInstance | null>(null)
// const formData = reactive({
//   name: ""
// })
// const formRules: FormRules = reactive({
//   name: [{ required: true, trigger: "blur", message: "请输入产品分类名称" }]
// })
// const handleCreate = () => {
//   formRef.value?.validate((valid: boolean, fields) => {
//     if (valid) {
//       if (currentUpdateId.value === undefined) {
//         createProductDataApi(formData)
//           .then(() => {
//             ElMessage.success("新增成功")
//             getProductData()
//           })
//           .finally(() => {
//             dialogVisible.value = false
//           })
//       } else {
//         updateProductDataApi({
//           id: currentUpdateId.value,
//           name: formData.name
//         })
//           .then(() => {
//             ElMessage.success("修改成功")
//             getProductData()
//           })
//           .finally(() => {
//             dialogVisible.value = false
//           })
//       }
//     } else {
//       console.error("表单校验不通过", fields)
//     }
//   })
// }
// const resetForm = () => {
//   currentUpdateId.value = undefined
//   formData.name = ""
// }
//#endregion

//#region 删
const handleDelete = (row: GetProductData) => {
  ElMessageBox.confirm(`正在删除产品分类：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteProductDataApi(row.id + "").then(() => {
      ElMessage.success("删除成功")
      getProductData()
    })
  })
}
//#endregion

//#region 改
// const currentUpdateId = ref<undefined | string>(undefined)
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
const productData = ref<GetProductData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  model: "",
  name: ""
})
const getProductData = () => {
  loading.value = true
  getProductDataApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    name: searchData.name || undefined
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
        <el-form-item prop="name" label="产品名称">
          <el-input v-model="searchData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="handleAdd">新增产品</el-button>
          <el-button type="danger" :icon="Delete">批量删除</el-button>
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
        <el-table :data="productData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="产品ID" align="center" />
          <el-table-column prop="model" label="产品编码" align="center" />
          <el-table-column prop="name" label="产品名称" align="center" />
          <el-table-column prop="serie.name" label="产品系列" align="center" />
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
