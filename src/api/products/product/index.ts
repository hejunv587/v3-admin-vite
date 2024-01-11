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

/** 翻页查询产品 */
export function getProductDataApi(params: Product.GetProductRequestData) {
  return request<Product.GetProductResponseData>({
    url: "product/pagequery",
    method: "get",
    params
  })
}

/** 单条记录查询产品 */
export function getProductApi(data: string) {
  return request<Product.GetOneProductResData>({
    url: `product/${data}`,
    method: "get"
  })
}

/** 查询所有产品,返回id,name,model,作为review关联选项 */
export function getAllProductApi() {
  return request<Product.GetAllProductResData>({
    url: "product",
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

/** 新增产品问答 */
export function createProductQAApi(data: Product.QA) {
  return request({
    url: "product/qa",
    method: "post",
    data
  })
}

/** 修改产品问答 */
export function updateProductQAApi(data: Product.QA) {
  return request({
    url: `product/qa/${data.id}`,
    method: "patch",
    data
  })
}

/** 删除产品问答 */
export function removeProductQAApi(id: string) {
  return request({
    url: `product/qa/${id}`,
    method: "delete"
  })
}

/** 新增产品相关 */
export function createAboutApi(data: Product.About) {
  return request({
    url: "product/about",
    method: "post",
    data
  })
}

/** 修改产品相关 */
export function updateAboutApi(data: Product.About) {
  return request({
    url: `product/about/${data.id}`,
    method: "patch",
    data
  })
}

/** 删除产品相关 */
export function removeAboutApi(id: string) {
  return request({
    url: `product/about/${id}`,
    method: "delete"
  })
}
