import { GetProductData, Upload } from "../product/types"

export interface ReviewData {
  id?: number
  productId?: string
  product?: GetProductData
  username?: string
  score: number
  content: string
  images?: Upload[]
  create_time?: string
}
