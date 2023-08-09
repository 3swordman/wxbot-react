export interface Good {
  title: string
  description: string
  longDescription?: string[]
  imageSrc: string[]
  price: number
  id: number
  category: string[]
}

export const API_URL = "http://api.score-store.siliconbio.org.cn"
