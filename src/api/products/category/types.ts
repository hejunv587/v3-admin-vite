export interface CreateCategoryRequestData {
  name: string
}

export interface UpdateCategoryRequestData {
  id: string
  name: string
}

export interface GetCategoryRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：用户名 */
  name?: string
  /** 查询参数：手机号 */
  create_time?: string
}

export interface GetCategoryData {
  createTime?: string
  id: string
  name: string
}

export type GetCategoryResponseData = ApiResponseData<{
  list: GetCategoryData[]
  total: number
}>
