export interface Calendar {
  service_id: string
  monday: number
  tuesday: number
  wednesday: number
  thursday: number
  friday: number
  saturday: number
  sunday: number
  start_date: number
  end_date: number
}

export interface Calendars {
  calendars: Calendar[]
}

export function encodeServiceIdUrl(service_id: string): string {
  return service_id.replaceAll("#", "hashtag").replaceAll("+", "plus")
}

export function decodeServiceIdUrl(url: string): string {
  return url.replaceAll("hashtag", "#").replaceAll("plus", "+")
}
