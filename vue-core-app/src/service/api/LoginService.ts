import { stringify } from "querystring"
import { ajax } from "@/http"

export class LoginService {
  static login(request: AuthTokenRequest): Promise<AuthTokenResponse> {
    const requestString = stringify(request as any)
    return ajax("POST", `/api/auth/oauth/token?${requestString}`, requestString, "FORM")
  }

  static logout(): Promise<AuthTokenResponse> {
    return ajax("DELETE", "/api/auth/token/logout", null)
  }
}

export interface AuthTokenRequest {
  grant_type?: string
  password?: string
  imgCode?: string
  username?: string
  randomStr?: string
  code?: string
}

export interface AuthTokenResponse {
  access_token: string | null
  dept_id: string | null
  expires_in: number | null
  license: string | null
  refresh_token: string | null
  scope: string | null
  token_type: string | null
  user_id: string | null
  username: string | null
  new_user: boolean | null
}
