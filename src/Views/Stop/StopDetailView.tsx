import { Grid } from "@mui/material"
import { useEffect, useRef } from "react"
import { Stop } from "../../Models/Stops"
// @ts-ignore
import mapboxgl from "mapbox-gl" // eslint-disable-line import/no-webpack-loader-syntax
import StopDetailComponent from "./StopDetailComponent"
import { useSelector } from "react-redux"
import { RootState } from "../../State/_Store"
import { useParams } from "react-router-dom"
import { Map, MapMethods } from "../_Components/_Components"

function StopDetailView() {
  let { stopId } = useParams()

  const stop: Stop | undefined = useSelector((state: RootState) =>
    state.stops.stops.find((stop) => stop.stop_id === stopId),
  )

  const mapRef = useRef<MapMethods | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    setupMap()
  }, [])

  function setupMap() {
    if (stop?.stop_lat !== undefined && stop.stop_lon !== undefined) {
      map.current.setCenter([stop.stop_lon, stop.stop_lat])

      mapRef.current?.addStopMarkers([stop])
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <StopDetailComponent stop={stop!} />
      </Grid>
      <Grid item xs={6}>
        <Map map={map} ref={mapRef} />
      </Grid>
    </Grid>
  )
}

export default StopDetailView
