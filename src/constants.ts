
export interface Good {
  title: string,
  description: string,
  longDescription?: string[],
  imageSrc: string[],
  price: number,
  id: number,
  category: string[]
}

export const API_URL = "https://api.score-store.intirain.cc"
