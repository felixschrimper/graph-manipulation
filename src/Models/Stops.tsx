export interface Stop {
  stop_id: string
  stop_code?: any
  stop_name: string
  tts_stop_name?: any
  stop_desc?: any
  stop_lat: number
  stop_lon: number
  zone_id?: any
  stop_url: string
  location_type?: any
  parent_station?: any
  stop_timezone?: any
  wheelchair_boarding?: any
  level_id?: any
  platform_code?: any
}

export interface Stops {
  stops: Stop[]
}
