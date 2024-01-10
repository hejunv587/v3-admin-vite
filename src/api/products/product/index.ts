import { request } from "@/utils/service"
import type * as Product from "./types"

/** 增 */
export function createProductDataApi(data: Product.UpdateProductRequestData) {
  return request({
    url: "product",
    method: "post",
    data
  })
}

/** 删 */
export function deleteProductDataApi(id: string) {
  return request({
    url: `product/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateProductDataApi(data: Product.UpdateProductRequestData) {
  return request({
    url: `product/${data.id}`,
    method: "patch",
    data
  })
}

/** 查 */
export function getProductDataApi(params: Product.GetProductRequestData) {
  return request<Product.GetProductResponseData>({
    url: "product/pagequery",
    method: "get",
    params
  })
}

/** 单条记录查 */
export function getProductApi(data: string) {
  return request<Product.GetOneProductResData>({
    url: `product/${data}`,
    method: "get"
  })
}

/** 获取图片url */
export function getImageUrlApi(data: string) {
  return request<Product.GetUtlResData>({
    url: `upload/geturl/${data}`,
    method: "get"
  })
}

/** 获取Uploads */
export function getUploadAPi(params: Product.GetUploadRequestData) {
  return request<Product.GetUploadResponseData>({
    url: `upload/pagequery`,
    method: "get",
    params
  })
}

/** 添加产品图片 */
export function addProductImagesApi(data: Product.AddProductImagesRequestData) {
  return request({
    url: `product/addimages/${data.id}`,
    method: "patch",
    data: data.imageIds
  })
}

/** 移除产品图片 */
export function removeProductImagesApi(data: Product.RemoveProductImagesRequestData) {
  return request({
    url: `product/removeimages/${data.id}`,
    method: "patch",
    data: data.image
  })
}
