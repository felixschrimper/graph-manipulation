import { Route as RouteIcon, Edit } from "@mui/icons-material"
import { Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Constants } from "../../General/Constants"
import { Route } from "../../Models/Routes"
import { Stop } from "../../Models/Stops"
import { client } from "../../Service/Client"
import { LoadingStatus } from "../../Service/LoadingStatus"
import { Loading, RoutePaper, StopPaper } from "../_Components/_Components"

interface Props {
  stop: Stop
}

function StopDetailComponent(props: Props) {
  const [routes, setRoutes] = useState<Route[]>([])
  const [routesLoadingState, setRoutesLoadingState] = useState<LoadingStatus>(LoadingStatus.idle)
  async function getRoutes(stopId: string) {
    setRoutesLoadingState(LoadingStatus.loading)
    try {
      const response = await client.get(
        Constants.api +
          "routes?" +
          new URLSearchParams({
            stopId: stopId,
          }),
      )
      setRoutes(response.data.routes)
      setRoutesLoadingState(LoadingStatus.succeeded)
    } catch (e) {
      setRoutesLoadingState(LoadingStatus.failed)
      console.log(e)
    }
  }

  useEffect(() => {
    getRoutes(props.stop.stop_id)
  }, [])

  return (
    <>
      <Grid container className="headlineContainer">
        <Typography variant="h4" className="iconTypography">
          <StopPaper id={props.stop.stop_id} text={props.stop.stop_name} />
        </Typography>
        <Link to={"/editStop/" + props.stop.stop_id}>
          <Edit fontSize="large" />
        </Link>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <StopPaper id={props.stop.stop_id} text={props.stop.stop_id} />
        </Grid>
        <Grid item xs={4}>
          <Typography>lon: {props.stop.stop_lon}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>lat: {props.stop.stop_lat}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            url:{" "}
            <a href={props.stop.stop_url} target="_blank" rel="noreferrer">
              {props.stop.stop_url}
            </a>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container className="headlineContainer">
            <Typography variant="h5" className="iconTypography">
              <RouteIcon />
              Routes
            </Typography>
          </Grid>
          <Grid container spacing={1}>
            {routesLoadingState === LoadingStatus.succeeded ? (
              routes.length > 0 ? (
                routes.map((route) => (
                  <Grid item key={route.route_id}>
                    <RoutePaper
                      text={route.route_short_name}
                      id={route.route_id}
                      color={route.route_color}
                      textColor={route.route_text_color}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  No routes found for this stop.
                </Grid>
              )
            ) : (
              <Grid item>
                <Loading text="Loading Routes" />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default StopDetailComponent
