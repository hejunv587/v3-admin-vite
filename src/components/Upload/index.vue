<template>
  <!-- 图片列表 -->
  <div class="image-list">
    <div v-for="image in images" :key="image.id" class="image-box">
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
    <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleCoverImageUpload">
      <el-button>上传新附件</el-button>
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue"
import { Upload } from "@/api/products/product/types"
import { Check } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
// import { defineEmits } from "vue"
import { getImageUrlApi, getUploadAPi } from "@/api/products/product"

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// Props (如果有的话)
const props = defineProps({
  multiple: Boolean, // 控制是单选还是多选
  selectedImages: {
    type: Array as () => ExtendedUploadDataType[],
    default: () => [] // 提供一个默认值
  }
})

const uploadUrl = import.meta.env.VITE_BASE_API + "/upload/album1"

// defineProps<{
//   multiple: Boolean // 控制是单选还是多选
// }>()

// 定义发送到父组件的事件
const emit = defineEmits(["update:selectedImages", "requestUploadData"])

interface ExtendedUploadDataType extends Upload {
  url: string
  selected?: boolean
}

// Data
const images = ref<ExtendedUploadDataType[]>([])
const loading = ref(false)

// Methods
const getUploadData = async () => {
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
        const isSelected = props.selectedImages.some((selected) => selected.id === element.id)
        return { ...element, url, selected: isSelected }
      })

      // 等待所有 Promise 完成
      const results = await Promise.all(promises)

      // 更新 uploadData 和 images
      // uploadData.value = results
      images.value = results
    })
    .catch(() => {
      images.value = []
    })
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

const toggleSelection = (image: ExtendedUploadDataType) => {
  if (!props.multiple) {
    // 单选逻辑
    // 对于单选，首先清除所有图片的选中状态
    images.value.forEach((image) => {
      image.selected = false
    })

    // 然后切换当前图片的选中状态
    image.selected = !image.selected
  } else {
    // 多选逻辑
    image.selected = !image.selected
  }
}

const confirmSelection = () => {
  const selectedImages = images.value.filter((img) => img.selected)
  console.log("选中的图片:", selectedImages)
  emit("update:selectedImages", selectedImages) // 触发事件，发送选择的图片
}

// ...其他方法如 uploadNewAttachment, handleCoverImageUpload 等
const handleCoverImageUpload = async (response: any) => {
  if (response.success && images.value) {
    //重新加载附件列表
    getUploadData()
  }
}

onMounted(() => {
  getUploadData()
})

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getUploadData, { immediate: true })
</script>

<style scoped>
/* 这里添加您的 CSS 样式 */
.image-list {
  width: 100%;
  /* height: 60vh; */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around; /* 确保图片均匀分布 */
}
.image-box {
  width: calc(20% - 10px); /* 一行五个图片，每个图片占20%，减去间隙 */
  margin: 5px; /* 图片之间的间隙 */
  cursor: pointer;
  position: relative;
}

.image-preview {
  width: 100%; /* 控制图片的宽度 */
  height: 100%; /* 控制图片的高度 */
  object-fit: cover; /* 保持图片的纵横比，多余的部分会被裁剪 */
  cursor: pointer;
}

.selected-icon {
  position: absolute;
  top: 0;
  right: 0;
  color: #409eff;
  font-size: 24px; /* 调整图标大小 */
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
