export interface VehicleType {
  route_type: number
  name: string
}

export const vehicleTypes: VehicleType[] = [
  { route_type: 0, name: "Tram" },
  { route_type: 1, name: "Metro" },
  { route_type: 2, name: "Rail" },
  { route_type: 3, name: "Bus" },
]
