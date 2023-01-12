import { groupBy } from "lodash"

export interface StopTime {
  id: number
  trip_id: string
  arrival_time: string
  arrival_timestamp: number
  departure_time: string
  departure_timestamp: number
  stop_id: string
  stop_sequence: number
  stop_headsign?: any
  pickup_type: number
  drop_off_type: number
  continuous_pickup?: any
  continuous_drop_off?: any
  shape_dist_traveled: number
  timepoint?: any
}

export interface TripStopTimeStop {
  stop_id: string
  stop_name: string
  stop_sequence: number
  arrival_time: string
  departure_time: string
}

export interface TripStopTime {
  trip_id: string
  service_id: string
  direction_id: number
  route_id: string
  shape_id: string
  stops: TripStopTimeStop[]
}

export interface Frequency {
  on: boolean
  timeInterval: number
  endTime: string
}

export function reduceTrips(trips: TripStopTime[], reduceBy: string[]): TripStopTime[][] {
  return Object.values(
    groupBy(trips, (trip: any) => reduceBy.map((reduce) => trip[reduce]).toString()),
  ).sort((a, b) => b.length - a.length)
}
