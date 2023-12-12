export interface LoginRequestData {
  /** admin 或 editor */
  username: "admin" | "editor"
  // name: "admin" | "editor" | "joy"
  /** 密码 */
  password: string
  /** 验证码 */
  captcha: string
}

export type LoginCodeResponseData = ApiResponseData<{ img: string; text: string }>

export type LoginResponseData = ApiResponseData<{ token: string }>

// export type UserInfoResponseData = ApiResponseData<{ name: string; roles: string[] }>
export type UserInfoResponseData = ApiResponseData<{ name: string; role: string }>
