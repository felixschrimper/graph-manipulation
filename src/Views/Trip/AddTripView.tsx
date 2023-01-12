import { Button, Card, CardContent, Grid, MenuItem, TextField, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { MyAlert, RouteSelector, TripPaper } from "../_Components/_Components"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../State/_Store"
import { LoadingStatus } from "../../Service/LoadingStatus"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { Add, Edit } from "@mui/icons-material"
import { Constants } from "../../General/Constants"
import { Frequency, TripStopTime, TripStopTimeStop } from "../../Models/StopTimes"
import { client } from "../../Service/Client"
import {
  CalendarMode,
  ServiceDetailComponent,
  ServiceMethods,
} from "../Service/ServiceDetailComponent"
import { updateShapes } from "../../State/Shapes"
import TripTimetable from "./TripTimetable"
import AddTripFrequency from "./AddTripFrequency"
import AddTripNewStop from "./AddTripNewStop"
import { decodeServiceIdUrl } from "../../Models/Calendars"
import { silentFetchCalendarDates } from "../../State/CalendarDates"
import { silentFetchCalendars } from "../../State/Calendars"

enum Mode {
  addTrip = "addTrip",
  addTrips = "addTrips",
  editTrip = "editTrip",
  editTrips = "editTrips",
}

function AddTripView() {
  // tripId to edit singel trip
  let { tripId } = useParams()
  const [searchParams] = useSearchParams()
  // routeId to create new trip
  const routeId: string = searchParams.get("routeId") ?? ""
  // serviceId and shapeId to edit multiple trips
  const serviceId: string = decodeServiceIdUrl(searchParams.get("serviceId") ?? "")
  const shapeId: string = searchParams.get("shapeId") ?? ""

  const dispatch = useDispatch<AppDispatch>()

  const [tripStopTimes, setTripStopTimes] = useState<TripStopTime[]>([
    {
      trip_id: "",
      service_id: "",
      direction_id: 0,
      route_id: routeId,
      shape_id: "",
      stops: [],
    },
  ])

  async function getTripStopTime() {
    try {
      const response = await client.get(
        Constants.api +
          "stopTimes?" +
          new URLSearchParams({
            tripId: tripId ?? "",
            serviceId: serviceId,
            shapeId: shapeId,
          }),
      )
      console.log(response.data)
      if (response.data.stopTimes.length > 0) {
        setTripStopTimes(response.data.stopTimes)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (tripId || (serviceId && shapeId)) {
      getTripStopTime()
    }
  }, [tripId])

  const serviceRef = useRef<ServiceMethods | null>(null)

  const [newStop, setNewStop] = useState<TripStopTimeStop>({
    stop_id: "",
    stop_name: "",
    stop_sequence: 0,
    arrival_time: "12:00",
    departure_time: "12:00",
  })

  const [showError, setShowError] = useState<boolean>(false)
  const [addTripStatus, setAddTripStatus] = useState<LoadingStatus>(LoadingStatus.idle)

  const [addedToRouteId, setAddedToRouteId] = useState<string>("")

  const [frequency, setFrequency] = useState<Frequency>({
    on: false,
    timeInterval: 0,
    endTime: "12:00",
  })

  function removeStop(stopId: string) {
    let newTripStopTimes = tripStopTimes.map((xxx: TripStopTime) => {
      return {
        ...xxx,
        stops: xxx.stops
          .filter((s) => s.stop_id !== stopId)
          .map((s, i) => {
            return { ...s, stop_sequence: i }
          }),
      }
    })
    setTripStopTimes(newTripStopTimes)
  }

  function canAddStop(): boolean {
    if (
      !newStop.stop_id ||
      newStop.arrival_time > newStop.departure_time ||
      (tripStopTimes[0].stops.length > 0 &&
        tripStopTimes[0].stops[tripStopTimes[0].stops.length - 1].departure_time >=
          newStop.arrival_time)
    ) {
      return false
    }
    return true
  }

  function addNewStop() {
    setTripStopTimes([
      {
        ...tripStopTimes[0],
        stops: [
          ...tripStopTimes[0].stops,
          { ...newStop, stop_sequence: tripStopTimes[0].stops.length },
        ],
      },
    ])
    setNewStop({
      stop_id: "",
      stop_name: "",
      stop_sequence: 0,
      arrival_time: newStop.departure_time,
      departure_time: newStop.departure_time,
    })
  }

  function canSaveTrip(): boolean {
    if (tripStopTimes[0].route_id && tripStopTimes[0].stops.length >= 2) {
      return true
    }
    setShowError(true)
    return false
  }

  async function saveTrip() {
    const { calendar, calendarDates } = serviceRef.current!.getCalendar()
    const saveNewTrip = {
      mode: mode.toString(),
      tripStopTimes: tripStopTimes,
      calendar: calendar,
      calendar_dates: calendarDates,
      frequency: frequency,
    }

    console.log(saveNewTrip)

    try {
      const response = await client.post(Constants.api + "trips", saveNewTrip)
      setAddTripStatus(LoadingStatus.succeeded)
      setAddedToRouteId(response.data.routeId)
      dispatch(updateShapes(routeId))
      if (!tripStopTimes[0].service_id) {
        dispatch(silentFetchCalendars())
        dispatch(silentFetchCalendarDates())
      }
    } catch (e) {
      setAddTripStatus(LoadingStatus.failed)
      console.log(e)
    }
  }

  var mode = tripId
    ? Mode.editTrip
    : routeId
    ? frequency.on
      ? Mode.addTrips
      : Mode.addTrip
    : Mode.editTrips

  return (
    <>
      <MyAlert
        showAlert={showError}
        setShowAlert={setShowError}
        message="Please fill out all fields and add minimum 2 stops."
        severity="error"
      />
      <Grid container className="headlineContainer">
        <Typography variant="h3" className="iconTypography">
          {mode === Mode.addTrip || mode === Mode.addTrips ? (
            <>
              <Add fontSize="inherit" /> {mode === Mode.addTrip ? "Add Trip" : "Add Trips"}
            </>
          ) : (
            <>
              <Edit fontSize="inherit" />
              {mode === Mode.editTrip ? "Edit Trip" : "Edit Trips"}
            </>
          )}
        </Typography>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 4, mb: 4 }}>
        {mode === Mode.editTrip || mode === Mode.editTrips ? (
          <Grid item xs={12}>
            <Typography component="span" mr={2}>
              {mode === Mode.editTrip ? "Trip Id:" : "Trip Ids:"}
            </Typography>
            {tripStopTimes.map((tripStopTime) => (
              <Typography component="span" mr={2} key={tripStopTime.trip_id}>
                <TripPaper id={tripStopTime.trip_id} />
              </Typography>
            ))}
          </Grid>
        ) : null}
        <Grid item xs={6}>
          <RouteSelector
            key={"RouteSelector" + tripStopTimes[0].route_id}
            routeId={tripStopTimes[0].route_id}
            selectedNewRoute={(routeId) => {
              const newTripStopTimes = tripStopTimes.map((tripStopTime) => {
                return { ...tripStopTime, route_id: routeId }
              })
              setTripStopTimes(newTripStopTimes)
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            value={tripStopTimes[0].direction_id}
            onChange={(e) => {
              const value = parseInt(e.target.value)
              const newTripStopTimes = tripStopTimes.map((tripStopTime) => {
                return { ...tripStopTime, direction_id: value }
              })
              setTripStopTimes(newTripStopTimes)
            }}
            label="Direction Id"
            select
            style={{ width: "50%" }}
          >
            <MenuItem value={0}>0</MenuItem>
            <MenuItem value={1}>1</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <ServiceDetailComponent
            ref={serviceRef}
            service_id={tripStopTimes[0].service_id}
            mode={CalendarMode.useCalendar}
            key={tripStopTimes[0].service_id}
          />
        </Grid>
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Grid container spacing={2}>
                {tripStopTimes[0].stops.length > 0 ? (
                  <Grid item xs={12}>
                    <TripTimetable
                      stopTimes={tripStopTimes}
                      removeStop={(stopId) => removeStop(stopId)}
                    />
                  </Grid>
                ) : null}
                {mode !== Mode.editTrips ? (
                  <>
                    <AddTripNewStop
                      newStop={newStop}
                      setNewStop={setNewStop}
                      saveNewStop={() => {
                        if (canAddStop()) {
                          addNewStop()
                          return true
                        } else {
                          return false
                        }
                      }}
                    />
                    {mode !== Mode.editTrip ? (
                      <AddTripFrequency frequency={frequency} setFrequency={setFrequency} />
                    ) : null}
                  </>
                ) : null}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={(e) => {
              if (canSaveTrip()) {
                e.currentTarget.disabled = true
                saveTrip()
              }
            }}
          >
            {addTripStatus === LoadingStatus.idle ? "Save" : addTripStatus.toString()}
          </Button>
          <Link
            to={"/route/" + (addedToRouteId !== "" ? addedToRouteId : tripStopTimes[0].route_id)}
          >
            <Button>{addTripStatus === LoadingStatus.succeeded ? "See Route" : "Cancel"}</Button>
          </Link>
        </Grid>
      </Grid>
    </>
  )
}

export default AddTripView
