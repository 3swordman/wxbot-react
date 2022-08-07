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

export async function getGoods(): Promise<Good[]> {
  // TODO: must cache!!!
  if (goods == null) {
    goods = JSON.parse((await axios.get<string>("/get-goods")).data) as Good[]
  }
  return goods
}

export async function getToken(username: string, password: string) {
  return JSON.parse((await axios.post("/login", JSON.stringify({
    username, password
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  })).data) as {
    success: boolean,
    loginToken: string
  }
}

export async function getConfirmText(username: string, password: string) {
  const content = JSON.parse((await axios.post("/signup", JSON.stringify({
    username, password
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  })).data) as {
    confirmText: string | null,
    loginToken: string | null
  }
  return content.confirmText
}

export async function verify(username: string) {
  return JSON.parse((await axios.post("/verify", JSON.stringify({
    username
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  })).data) as {
    success: boolean,
    confirmText: string | null
  }

}

export async function checkout(username: string, loginToken: string, goods: [Good, number][]) {
  return JSON.parse((await axios.post("/checkout", JSON.stringify({
    username, 
    loginToken,
    goods: goods.map(([good, count]) => ({
      id: good.id,
      count
    }))
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  })).data) as {
    success: boolean,
    errCode: number
  }

}

export async function getScore(username: string): Promise<number> {
  return JSON.parse((await axios.get("/get-score-info", {
    params: {
      username
    }
  })).data).score

}