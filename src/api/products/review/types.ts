import { GetProductData, Upload } from "../product/types"

export interface ReviewData {
  id?: number
  productId?: number
  product?: GetProductData
  username?: string
  score: number
  content: string
  images?: Upload[]
  create_time?: string
}

// 扩展 Upload 接口
export interface ExtendedUpload extends Upload {
  url?: string
}

export interface newReviewData {
  id?: number
  productId?: number
  product?: GetProductData
  username?: string
  score: number
  content: string
  images?: ExtendedUpload[] // 使用 ExtendedUpload 替代 Upload
  create_time?: string
}

export interface GetReviewRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：产品id */
  productId: string
}

export interface CreateReviewRequest {
  id?: number
  username: string
  score: number
  content: string
  productId: number
  images?: Upload[]
}

export type GetReviewResponseData = ApiResponseData<{
  list: ReviewData[]
  total: number
}>
