import { Axios } from "axios"
import { API_URL, Good } from "./constants"

const axios = new Axios({
  baseURL: API_URL
})

let goods: Good[] | null = null

function sleep(time: number): Promise<void> {
  return new Promise<void>((res, rej) => {
    setTimeout(res, time)
  })
}

async function postRequest<ReturnType>(url: string, data: unknown) {
  return JSON.parse((await axios.post(url, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json"
    }
  })).data) as ReturnType
}

export async function getGoods(): Promise<Good[]> {
  // TODO: must cache!!!
  if (goods == null) {
    goods = JSON.parse((await axios.get<string>("/get-goods")).data).goods as Good[]
  }
  return goods
}

export async function getToken(username: string, password: string) {
  return await postRequest<{
    success: boolean,
    loginToken: string
  }>("/login", { username, password })
}

export async function getConfirmText(username: string, password: string) {
  const content = await postRequest<{
    confirmText: string | null,
    loginToken: string | null
  }>("/signup", { username, password })
    
  return content.confirmText
}

export async function verify(username: string) {
  return postRequest<{
    success: boolean,
    confirmText: string | null
  }>("/verify", { username })

}

export async function checkout(username: string, loginToken: string, goods: [Good, number][]) {
  return postRequest<{
    success: boolean,
    errCode: number
  }>("/checkout", {
    username, 
    loginToken,
    goods: goods.map(([good, count]) => ({
      id: good.id,
      count
    }))
  })

}

export async function getScore(username: string): Promise<number> {
  return JSON.parse((await axios.get("/get-score-info", {
    params: {
      username
    }
  })).data).score

}