import { request } from "@/utils/service"
import type * as Category from "./types"

/** 增 */
export function createCategoryDataApi(data: Category.CreateCategoryRequestData) {
  return request({
    url: "category",
    method: "post",
    data
  })
}

/** 删 */
export function deleteCategoryDataApi(id: string) {
  return request({
    url: `category/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateCategoryDataApi(data: Category.UpdateCategoryRequestData) {
  return request({
    url: `category/${data.id}`,
    method: "patch",
    data: { name: data.name }
  })
}

/** 查 */
export function getCategoryDataApi(params: Category.GetCategoryRequestData) {
  return request<Category.GetCategoryResponseData>({
    url: "category/pagequery",
    method: "get",
    params
  })
}

/** 查寻全部 */
export function getAllCategoryApi() {
  return request<ApiResponseData<Category.GetCategoryData[]>>({
    url: "category",
    method: "get"
  })
}
