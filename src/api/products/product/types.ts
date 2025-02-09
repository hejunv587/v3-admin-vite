import { GetCategoryData } from "../category/types"

export interface Upload {
  id: string
  name?: string
  type?: string | null
  path?: string
  desc?: string | null
  thumbnail?: string | null
  product?: GetProductData | null
  create_time?: Date
}

export interface About {
  id?: number
  name: string
  desc: string
  productId?: string
  product?: GetProductData
}

export interface QA {
  id?: number
  q: string
  a: string
  productId?: string
  product?: GetProductData
}

// export interface CreateProductRequestData {
//   model: string

//   name: string

//   description: string

//   overview: string

//   functions: string[]

//   advantages: string[]

//   technical_parameters: string[]

//   services: string[]

//   whychoose: string[]

//   note: string[]
// }

export interface UpdateProductRequestData {
  id?: number
  model: string
  serie: GetCategoryData | null
  description: string
  overview: string
  functions: string[]
  advantages: string[]
  technical_parameters: string[]
  name: string
  services: string[]
  whychoose: string[]
  note: string[]
  cover?: Upload
}

//添加图片接口
export interface AddProductImagesRequestData {
  id: string
  imageIds: string[]
}

//移除图片接口
export interface RemoveProductImagesRequestData {
  id: string
  image: {
    uploadId: string
  }
}

export interface GetProductRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：产品名 */
  name?: string
  /** 查询参数：产品编码 */
  model?: string
}

export interface GetUploadRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
}

export interface GetProductData {
  id: number
  model: string
  serie?: GetCategoryData | null
  name: string
  cover?: Upload
  images?: Upload[]
  description?: string
  overview?: string
  functions?: string
  advantages?: string
  technical_parameters?: string
  about?: About[]
  services?: string
  whychoose?: string
  note?: string
  qas?: QA[]
}

export type GetProductResponseData = ApiResponseData<{
  list: GetProductData[]
  total: number
}>

export type GetOneProductResData = ApiResponseData<GetProductData>

export type GetAllProductResData = ApiResponseData<GetProductData[]>

export type GetUtlResData = ApiResponseData<string>

export type GetUploadResponseData = ApiResponseData<{
  list: Upload[]
  total: number
}>
