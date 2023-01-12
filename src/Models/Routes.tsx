import { groupBy } from "lodash"

export interface Route {
  route_id: string
  route_short_name: string
  route_long_name: string
  route_type: number
  route_color: string
  route_text_color: string
  start_date: number
  end_date: number
}

export interface Routes {
  routes: Route[]
}

export function formRouteDataForMap(data: Route[]): Route[][] {
  const typeGroups = Object.values(groupBy(data, "route_type"))
  const x = typeGroups
    .map((data) => Object.values(groupBy(data, "route_short_name")))
    .flatMap((r) => r)
  return x
}
