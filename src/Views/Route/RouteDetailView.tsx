import { Grid } from "@mui/material"
import { useEffect, useRef } from "react"
import { Route } from "../../Models/Routes"
// @ts-ignore
import mapboxgl from "mapbox-gl" // eslint-disable-line import/no-webpack-loader-syntax
import RouteDetailComponent from "./RouteDetailComponent"
import { useSelector } from "react-redux"
import { RootState } from "../../State/_Store"
import { useParams } from "react-router-dom"
import { Map, MapMethods } from "../_Components/_Components"

function RouteDetailView() {
  const { routeId } = useParams()

  const route: Route | undefined = useSelector((state: RootState) =>
    state.routes.routes.find((route) => route.route_id === routeId),
  )

  const mapRef = useRef<MapMethods | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (route) {
      map.current.on("load", () => {
        mapRef.current?.showRoute(route.route_id)
      })
    }
  }, [route])

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <RouteDetailComponent route={route!} map={map} mapRef={mapRef} />
      </Grid>
      <Grid item xs={4}>
        <Map ref={mapRef} map={map} />
      </Grid>
    </Grid>
  )
}

export default RouteDetailView
