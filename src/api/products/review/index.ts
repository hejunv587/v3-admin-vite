import { request } from "@/utils/service"
import type * as Review from "./types"

/** 增 */
export function createReviewApi(data: Review.CreateReviewRequest) {
  return request({
    url: "review",
    method: "post",
    data
  })
}

/** 查 */
export function getReviewApi(params: Review.GetReviewRequestData) {
  return request<Review.GetReviewResponseData>({
    url: "review/pagequery",
    method: "get",
    params
  })
}

/** 产品id查寻全部评论 */
export function getReviewByPrdApi(productId: number) {
  return request<ApiResponseData<Review.ReviewData[]>>({
    url: `review/${productId}`,
    method: "get"
  })
}

/** 改 */
export function updateReviewApi(id: number, data: Review.CreateReviewRequest) {
  return request({
    url: `review/${id}`,
    method: "patch",
    data
  })
}
