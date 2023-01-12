import { Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Constants } from "../../General/Constants"
import { client } from "../../Service/Client"
import { TripStopTime } from "../../Models/StopTimes"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { CalendarMode, ServiceDetailComponent } from "../Service/ServiceDetailComponent"
import TripPaper from "../_Components/TripPaper"
import { DeleteTrips, RoutePaper } from "../_Components/_Components"
import { useSelector } from "react-redux"
import { RootState } from "../../State/_Store"
import { Route } from "../../Models/Routes"
import { AltRoute, Edit } from "@mui/icons-material"
import { encodeServiceIdUrl } from "../../Models/Calendars"
import TripTimetable from "./TripTimetable"

enum Mode {
  showTrip,
  showTrips,
}

function TripsDetailView() {
  const { tripId } = useParams()
  const [searchParams] = useSearchParams()
  const serviceId: string = searchParams.get("serviceId") ?? ""
  const shapeId: string = searchParams.get("shapeId") ?? ""

  const mode: Mode = tripId ? Mode.showTrip : Mode.showTrips

  const [stopTimes, setStoptimes] = useState<TripStopTime[]>([])
  async function getStopTimes() {
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
      setStoptimes(response.data.stopTimes)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getStopTimes()
  }, [tripId])

  const route: Route | undefined = useSelector((state: RootState) =>
    state.routes.routes.find((route) => route.route_id === stopTimes[0]?.route_id),
  )

  return (
    <>
      {mode === Mode.showTrip ? (
        <Grid container className="headlineContainer">
          <Typography variant="h4" className="iconTypography">
            <TripPaper id={tripId!} />{" "}
          </Typography>
          <DeleteTrips trips={stopTimes} deleteTrips={() => setStoptimes([])} />
          <Link to={"/editTrip/" + tripId}>
            <Edit fontSize="large" />
          </Link>
        </Grid>
      ) : (
        <Grid container className="headlineContainer">
          <Typography variant="h4" className="iconTypography">
            <AltRoute fontSize="inherit" />
            Trip Group
          </Typography>
          <DeleteTrips trips={stopTimes} deleteTrips={() => setStoptimes([])} />
          <Link to={"/editTrip?serviceId=" + encodeServiceIdUrl(serviceId) + "&shapeId=" + shapeId}>
            <Edit fontSize="large" />
          </Link>
        </Grid>
      )}
      <Grid container spacing={2} sx={{ mb: 4 }} key={tripId}>
        {mode === Mode.showTrips ? (
          <Grid item xs={12}>
            <Typography component="span" mr={2}>
              Trip Ids ({stopTimes.length}):
            </Typography>
            {stopTimes.map((stopTime) => (
              <Typography component="span" mr={2} key={stopTime.trip_id}>
                <TripPaper id={stopTime.trip_id} />
              </Typography>
            ))}
          </Grid>
        ) : null}
        <Grid item xs={12}>
          <Typography>
            Route Id:{" "}
            {route ? (
              <>
                <RoutePaper
                  text={route.route_short_name}
                  id={route.route_id}
                  color={route.route_color}
                  textColor={route.route_text_color}
                />{" "}
                <RoutePaper
                  text={route.route_id}
                  id={route.route_id}
                  color={route.route_color}
                  textColor={route.route_text_color}
                />
              </>
            ) : null}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            Direction Id:
            <b> {stopTimes[0]?.direction_id}</b>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {stopTimes[0] ? (
            <ServiceDetailComponent
              service_id={stopTimes[0].service_id}
              mode={CalendarMode.showCalendar}
            />
          ) : null}
        </Grid>
        {stopTimes.length > 0 ? (
          <Grid item xs={12}>
            <TripTimetable stopTimes={stopTimes} />
          </Grid>
        ) : null}
      </Grid>
    </>
  )
}

export default TripsDetailView
