export interface Properties {
  route_id: string
  route_short_name: string
  route_long_name: string
  route_type: number
  route_color: string
  route_text_color: string
}

export interface Geometry {
  type: string
  coordinates: number[][]
}

export interface Feature {
  type: string
  properties: Properties
  geometry: Geometry
}

export interface Shapes {
  type: string
  features: Feature[]
}
