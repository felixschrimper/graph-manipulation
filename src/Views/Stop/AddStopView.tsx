import { Button, Grid, TextField, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { Stop } from "../../Models/Stops"
// @ts-ignore
import mapboxgl from "!mapbox-gl" // eslint-disable-line import/no-webpack-loader-syntax
import { MyAlert, Map } from "../_Components/_Components"
import { addStop } from "../../State/Stops"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../State/_Store"
import { LoadingStatus } from "../../Service/LoadingStatus"
import { Link, useParams } from "react-router-dom"
import { Add, Edit } from "@mui/icons-material"
import { Constants } from "../../General/Constants"

enum Mode {
  addStop,
  editStop,
}

function AddStopView() {
  const { stopId } = useParams()
  const mode: Mode = stopId ? Mode.editStop : Mode.addStop

  const dispatch = useDispatch<AppDispatch>()
  const map = useRef<mapboxgl.Map | null>(null)

  const stop: Stop | undefined = useSelector((state: RootState) =>
    state.stops.stops.find((stop) => stop.stop_id === stopId),
  )

  const [newStop, setNewStop] = useState<Stop>(
    stop ?? {
      stop_id: "",
      stop_name: "",
      stop_lat: Constants.munichCoordinates.lat,
      stop_lon: Constants.munichCoordinates.lon,
      stop_url: "",
    },
  )

  const [mapLat, setMapLat] = useState<number | undefined>(undefined)
  const [mapLon, setMapLon] = useState<number | undefined>(undefined)

  const [showError, setShowError] = useState<boolean>(false)
  const [addStopStatus, setAddStopStatus] = useState<LoadingStatus>(LoadingStatus.idle)

  var currentMarker: mapboxgl.Marker | undefined = undefined

  function setMarker(lat: number, lon: number) {
    if (currentMarker) {
      currentMarker.remove()
    }
    const el = document.createElement("div")
    el.className = "marker"
    currentMarker = new mapboxgl.Marker(el).setLngLat([lon, lat]).addTo(map.current)
  }

  useEffect(() => {
    updateCoordinates()
  }, [newStop])

  function updateCoordinates() {
    map.current.on("click", (e: mapboxgl.MapMouseEvent) => {
      setNewStop({ ...newStop, stop_lat: e.lngLat.lat, stop_lon: e.lngLat.lng })
      setMarker(e.lngLat.lat, e.lngLat.lng)
    })
  }

  useEffect(() => {
    setupMap()
  }, [])

  function setupMap() {
    map.current.on("mousemove", (e: mapboxgl.MapMouseEvent) => {
      setMapLat(e.lngLat.lat)
      setMapLon(e.lngLat.lng)
    })
    map.current.setCenter([newStop.stop_lon, newStop.stop_lat])
    setMarker(newStop.stop_lat, newStop.stop_lon)
  }

  function trySave(): boolean {
    if (newStop.stop_name && newStop.stop_lat && newStop.stop_lon) {
      saveStop()
      return true
    }
    setShowError(true)
    return false
  }

  async function saveStop() {
    try {
      setAddStopStatus(LoadingStatus.loading)
      await dispatch(addStop(newStop)).unwrap()
    } catch (e) {
      setAddStopStatus(LoadingStatus.failed)
    } finally {
      setAddStopStatus(LoadingStatus.succeeded)
    }
  }

  return (
    <>
      <MyAlert
        showAlert={showError}
        setShowAlert={setShowError}
        message="Please fill out all fields."
        severity="error"
      />
      <Grid container className="headlineContainer">
        <Typography variant="h3" className="iconTypography">
          {mode === Mode.addStop ? <Add fontSize="inherit" /> : <Edit fontSize="inherit" />}
          {mode === Mode.addStop ? "Add Stop" : "Edit Stop"}
        </Typography>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                onChange={(e) => {
                  setNewStop({ ...newStop, stop_name: e.target.value })
                }}
                value={newStop.stop_name}
                className="searchBar"
                label="Stop name"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                onChange={(e) => {
                  setNewStop({
                    ...newStop,
                    stop_lat: parseFloat(e.target.value),
                  })
                }}
                value={newStop.stop_lat}
                className="searchBar"
                label="Latitude"
                variant="outlined"
                type="number"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                onChange={(e) => {
                  setNewStop({
                    ...newStop,
                    stop_lon: parseFloat(e.target.value),
                  })
                }}
                value={newStop.stop_lon}
                className="searchBar"
                label="Longitude"
                variant="outlined"
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={(e) => {
                  if (trySave()) {
                    e.currentTarget.disabled = true
                  }
                }}
                variant="contained"
              >
                {addStopStatus.toString() === "Idle" ? "Save Stop" : addStopStatus.toString()}
              </Button>
              <Link to="/stops">
                <Button>
                  {addStopStatus === LoadingStatus.succeeded ? "Back to Stops" : "Cancel"}
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <div className="sidebar">
            Latitude: {mapLat} <br /> Longitude: {mapLon}
          </div>
          <Map map={map} />
        </Grid>
      </Grid>
    </>
  )
}

export default AddStopView
