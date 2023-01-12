import { Button, Grid, Typography } from "@mui/material"
import { DirectionsBus, Edit } from "@mui/icons-material"
import { useState } from "react"
import { Constants } from "../../General/Constants"
import { Route } from "../../Models/Routes"
import { Stop } from "../../Models/Stops"
import { client } from "../../Service/Client"
// @ts-ignore
import mapboxgl from "mapbox-gl" // eslint-disable-line import/no-webpack-loader-syntax
import { Link } from "react-router-dom"
import { DeleteRoute, Loading, MapMethods, RoutePaper, StopPaper } from "../_Components/_Components"
import TripsView from "../Trip/TripsView"
import { LoadingStatus } from "../../Service/LoadingStatus"

interface Props {
  route: Route
  map: React.MutableRefObject<any>
  mapRef: React.MutableRefObject<MapMethods | null>
}

function RouteDetailComponent(props: Props) {
  const [stops, setStops] = useState<Stop[]>([])
  const [stopsLoadingState, setStopsLoadingState] = useState<LoadingStatus>(LoadingStatus.idle)
  async function getStops(routeId: string) {
    setStopsLoadingState(LoadingStatus.loading)
    try {
      const response = await client.get(
        Constants.api +
          "stops?" +
          new URLSearchParams({
            routeId: routeId,
          }),
      )
      setStops(response.data.stops)
      setStopsLoadingState(LoadingStatus.succeeded)

      setMarkers(props.mapRef.current!.addStopMarkers(response.data.stops, props.route.route_color))
    } catch (e) {
      console.log(e)
      setStopsLoadingState(LoadingStatus.failed)
    }
  }

  const [showTrips, setShowTrips] = useState<boolean>(false)

  var [markers, setMarkers] = useState<mapboxgl.Marker[]>([])

  return (
    <>
      <Grid container className="headlineContainer">
        <Typography variant="h5" className="iconTypography">
          <RoutePaper
            text={props.route.route_short_name}
            id={props.route.route_id}
            color={props.route.route_color}
            textColor={props.route.route_text_color}
          />
        </Typography>
        <DeleteRoute routeId={props.route.route_id} />
        <Link to={"/editRoute/" + props.route.route_id}>
          <Edit fontSize="large" />
        </Link>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">
            <RoutePaper
              text={props.route.route_long_name}
              id={props.route.route_id}
              color={props.route.route_color}
              textColor={props.route.route_text_color}
            />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            <RoutePaper
              text={props.route.route_id}
              id={props.route.route_id}
              color={props.route.route_color}
              textColor={props.route.route_text_color}
            />
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            Type:
            <b>
              {" " + props.route.route_type + " "}(
              {
                Constants.vehicleTypes.find((type) => type.route_type === props.route.route_type)
                  ?.name
              }
              )
            </b>
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            Color: <b>{props.route.route_color}</b>
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            Text Color: <b>{props.route.route_text_color}</b>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() =>
              stopsLoadingState === LoadingStatus.idle
                ? getStops(props.route.route_id)
                : markers.length === 0
                ? setMarkers(props.mapRef.current!.addStopMarkers(stops, props.route.route_color))
                : (props.mapRef.current?.removeStopMarkers(markers), setMarkers([]))
            }
          >
            {markers.length === 0 ? "Show Stops " : "Hide Stops "}
          </Button>
          {stopsLoadingState === LoadingStatus.loading ? (
            <Loading text="Loading Stops" />
          ) : stopsLoadingState === LoadingStatus.succeeded ? (
            markers.length > 0 ? (
              <>
                <Grid container className="headlineContainer">
                  <Typography variant="h5" className="iconTypography">
                    <DirectionsBus />
                    Stops
                  </Typography>
                </Grid>
                <Grid container spacing={1}>
                  {stops.map((stop: Stop) => (
                    <Grid item key={stop.stop_id}>
                      <StopPaper id={stop.stop_id} text={stop.stop_name} />
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : stops.length > 0 ? null : (
              <Grid container spacing={1}>
                <Grid item>No stops found for this route.</Grid>
              </Grid>
            )
          ) : null}
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={() => setShowTrips(!showTrips)}>
            {showTrips ? "Hide Trips" : "Show Trips"}
          </Button>
          {showTrips ? <TripsView routeId={props.route.route_id} /> : null}
        </Grid>
      </Grid>
    </>
  )
}

export default RouteDetailComponent
