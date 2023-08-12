import { useQuery, QueryClient } from "@tanstack/react-query"
import { API_URL, Good } from "./constants"

export const queryClient = new QueryClient()

function sleep(time: number): Promise<void> {
  return new Promise<void>((res, rej) => {
    setTimeout(res, time)
  })
}

async function postRequest<ReturnType>(url: string, data: unknown) {
  return (await (
    await fetch(API_URL + url, {
      body: JSON.stringify(data),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
  ).json()) as ReturnType
}

export function useGoods() {
  return useQuery({
    queryKey: ["get-goods"],
    queryFn: async () => (await (await fetch(API_URL + "/get-goods")).json()).goods as Good[],
    placeholderData: []
  })
}

export async function getToken(username: string, password: string) {
  return await postRequest<{
    success: boolean
    loginToken: string
  }>("/login", { username, password })
}

export async function getConfirmText(username: string, password: string) {
  const content = await postRequest<{
    confirmText: string | null
    loginToken: string | null
  }>("/signup", { username, password })

  return content.confirmText
}

export async function verify(username: string) {
  return postRequest<{
    success: boolean
    confirmText: string | null
  }>("/verify", { username })
}

export async function checkout(username: string, loginToken: string, goods: [Good, number][]) {
  return postRequest<{
    success: boolean
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
  return (
    await (
      await fetch(
        API_URL +
          "/get-score-info?" +
          new URLSearchParams({
            username
          }).toString()
      )
    ).json()
  ).score
}

export function useScore(username: string | undefined) {
  const { data } = useQuery({
    queryKey: ["get-score", username],
    queryFn: () => (username ? getScore(username) : null)
  })
  return username ? data ?? null : null
}

export async function sellGoods(name: string, description: string, price: number, loginToken: string) {
  return postRequest<{
    success: boolean
  }>("/sell-goods", {
    name,
    description,
    price,
    loginToken
  })
}

export function useThingsSold(loginToken: string) {
  return useQuery({
    queryKey: ["get-things-sold", loginToken],
    queryFn: () =>
      postRequest<{ data: { goods: Array<Good>; goodsBought: Array<{}> } | null }>("/get-things-sold", { loginToken })
  })
}
