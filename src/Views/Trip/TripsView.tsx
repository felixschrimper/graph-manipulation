import { Button, Checkbox, FormControlLabel, Grid, IconButton, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { DeleteTrips, Loading, StopPaper, TripPaper } from "../_Components/_Components"
import { decodeServiceIdUrl, encodeServiceIdUrl } from "../../Models/Calendars"
import { TripStopTime, reduceTrips } from "../../Models/StopTimes"
import { Constants } from "../../General/Constants"
import { client } from "../../Service/Client"
import { AddCircleOutline, AltRoute, Edit } from "@mui/icons-material"
import { LoadingStatus } from "../../Service/LoadingStatus"
import { CalendarSummaryPopup } from "../_Components/_Components"

function TripsView(props: { routeId?: string; serviceId?: string }) {
  const groupByOptions = ["shape_id", "service_id", "direction_id"]
  const [groupBy, setGroupBy] = useState<string[]>(groupByOptions)

  const [trips, setTrips] = useState<TripStopTime[]>([])
  const [tripsLoadingState, setTripsLoadingState] = useState<LoadingStatus>(LoadingStatus.idle)
  async function getTripStopTimes(routeId?: string, serviceId?: string) {
    setTripsLoadingState(LoadingStatus.loading)
    var rId = routeId ? routeId : ""
    var sId = serviceId ? serviceId : ""
    try {
      const response = await client.get(
        Constants.api +
          "stopTimes?" +
          new URLSearchParams({
            routeId: rId,
            serviceId: decodeServiceIdUrl(sId),
          }),
      )
      setTrips(response.data.stopTimes)
      setTripsLoadingState(LoadingStatus.succeeded)
    } catch (e) {
      console.log(e)
      setTripsLoadingState(LoadingStatus.failed)
    }
  }

  const reducedTrips = reduceTrips(trips, groupBy)

  useEffect(() => {
    if (props.routeId) {
      getTripStopTimes(props.routeId)
    }
    if (props.serviceId) {
      getTripStopTimes(undefined, props.serviceId)
    }
  }, [])

  return (
    <>
      <Grid container className="headlineContainer">
        <Typography variant="h5" className="iconTypography">
          <AltRoute />
          Trips
        </Typography>
        {props.routeId ? (
          <Link to={"/addTrip?routeId=" + props.routeId}>
            <AddCircleOutline fontSize="large" />
          </Link>
        ) : null}
      </Grid>
      {tripsLoadingState === LoadingStatus.loading ? (
        <Loading text="Loading Trips" />
      ) : trips.length === 0 ? (
        <Typography>No trips for this Route.</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item>
              <Typography>Group by (currently {reducedTrips.length} groups):</Typography>
              {groupByOptions.map((option) => {
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => {
                          e.target.checked
                            ? setGroupBy([...groupBy, option])
                            : setGroupBy(
                                groupBy.filter((currentOption) => currentOption !== option),
                              )
                        }}
                        checked={groupBy.includes(option)}
                      />
                    }
                    label={option}
                    key={option}
                  />
                )
              })}
            </Grid>
          </Grid>
          {reducedTrips.map((tripGroup: TripStopTime[]) => (
            <Grid
              container
              mb={4}
              mt={4}
              spacing={1}
              style={{ border: "solid 1px", borderRadius: "4px" }}
              key={tripGroup[0].trip_id}
            >
              <Grid item xs={10}>
                {groupBy.includes("shape_id") ? (
                  <Typography>
                    <StopPaper
                      id={tripGroup[0].stops[0].stop_id}
                      text={tripGroup[0].stops[0].stop_name}
                    />{" "}
                    -{" "}
                    <StopPaper
                      id={tripGroup[0].stops[tripGroup[0].stops.length - 1].stop_id}
                      text={tripGroup[0].stops[tripGroup[0].stops.length - 1].stop_name}
                    />
                  </Typography>
                ) : null}
              </Grid>
              <Grid item xs={2} textAlign="right">
                {groupBy.includes("shape_id") && groupBy.includes("service_id") ? (
                  <IconButton>
                    <Link
                      to={
                        "/editTrip?serviceId=" +
                        encodeServiceIdUrl(tripGroup[0].service_id) +
                        "&shapeId=" +
                        tripGroup[0].shape_id
                      }
                    >
                      <Edit fontSize="large" />
                    </Link>
                  </IconButton>
                ) : null}
                <DeleteTrips
                  trips={tripGroup}
                  deleteTrips={(tripGroup) =>
                    setTrips(trips.filter((trip) => !tripGroup.includes(trip)))
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <Typography>
                  Length: <b>{tripGroup.length}</b>
                </Typography>
              </Grid>
              {groupBy.includes("service_id") ? (
                <Grid item xs={4}>
                  <CalendarSummaryPopup serviceId={tripGroup[0].service_id} />
                </Grid>
              ) : null}
              {groupBy.includes("direction_id") ? (
                <Grid item xs={4}>
                  <Typography>
                    Direction Id: <b>{tripGroup[0].direction_id}</b>
                  </Typography>
                </Grid>
              ) : null}
              {groupBy.includes("shape_id") && groupBy.includes("service_id") ? (
                <Grid item xs={12}>
                  <Link
                    to={
                      "/trips?serviceId=" +
                      encodeServiceIdUrl(tripGroup[0].service_id) +
                      "&shapeId=" +
                      tripGroup[0].shape_id
                    }
                  >
                    <Button variant="contained">Show Timetable</Button>
                  </Link>
                </Grid>
              ) : null}
              <Grid item>
                {tripGroup.map((tripStopTime) => {
                  return (
                    <Typography component="span" mr={2} key={tripStopTime.trip_id}>
                      <TripPaper id={tripStopTime.trip_id} />
                    </Typography>
                  )
                })}
              </Grid>
            </Grid>
          ))}
        </>
      )}
    </>
  )
}

export default TripsView
