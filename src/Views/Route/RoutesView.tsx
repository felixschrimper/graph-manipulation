import { useRef, useState } from "react"
// @ts-ignore
import mapboxgl from "mapbox-gl" // eslint-disable-line import/no-webpack-loader-syntax
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from "@mui/material"
import { Route as RouteIcon } from "@mui/icons-material"
import { AddCircleOutline, ExpandMore } from "@mui/icons-material"
import { Route } from "../../Models/Routes"
import { Constants } from "../../General/Constants"
import { MyAlert, Map, MyVisibility, MapMethods, RoutePaper } from "../_Components/_Components"
import RouteDetailComponent from "./RouteDetailComponent"
import { useSelector } from "react-redux"
import { RootState } from "../../State/_Store"
import { VehicleType } from "../../General/VehicleTypes"
import { Link } from "react-router-dom"
import { numberToDate } from "../../Models/CalendarDates"

function RoutesView() {
  console.log("Routes View")
  const routes: Route[][] = useSelector((state: RootState) => state.routes.routesForMap)

  const [shownRoutes, setShownRoutes] = useState<string[]>([])
  const mapRef = useRef<MapMethods | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [showError, setShowError] = useState(false)

  function allRoutesOfTypeShown(type: number): boolean {
    return (
      getRoutesOfType(type)
        .flatMap((r) => r)
        .find((route) => !shownRoutes.includes(route.route_id)) === undefined
    )
  }

  function getRoutesOfType(type: number): Route[][] {
    return routes.filter((routes) => routes[0].route_type === type)
  }

  function showRoute(route: Route) {
    mapRef.current?.showRoute(route.route_id)
    setShownRoutes([...shownRoutes, route.route_id!])
  }

  function showRoutes(routes: Route[]) {
    mapRef.current?.showRoutes(routes.map((route) => route.route_id))
    setShownRoutes([...shownRoutes, ...routes.map((route) => route.route_id)])
  }

  function hideRoute(route: Route) {
    mapRef.current?.hideRoute(route.route_id ?? "")
    setShownRoutes(shownRoutes.filter((showRoute) => showRoute !== route.route_id!))
  }

  function hideRoutes(routes: Route[]) {
    mapRef.current?.hideRoutes(routes.map((route) => route.route_id))
    setShownRoutes(
      shownRoutes.filter((showRoute) => !routes.map((route) => route.route_id).includes(showRoute)),
    )
  }

  function showRouteType(vehicle: VehicleType) {
    const addedRoutes = mapRef.current!.showRoutesOfType(vehicle.route_type)
    if (addedRoutes.length === 0) {
      setShowError(true)
    } else {
      setShownRoutes([...shownRoutes, ...addedRoutes])
    }
  }

  function hideRouteType(vehicle: VehicleType) {
    const routesToRemove = mapRef.current!.hideRoutesOfType(vehicle.route_type)
    setShownRoutes(shownRoutes.filter((shape) => !routesToRemove.includes(shape)))
  }

  return (
    <>
      <MyAlert
        showAlert={showError}
        setShowAlert={setShowError}
        message="To many shapes to show at once."
        severity="error"
      />
      <Grid container className="headlineContainer">
        <Typography variant="h3" className="iconTypography">
          <RouteIcon fontSize="inherit" />
          Routes ({routes.length})
        </Typography>
        <Link to="/addRoute/">
          <AddCircleOutline fontSize="large" />
        </Link>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={3} className="scrollableAccordion">
          {Constants.vehicleTypes.map((vehicle) => (
            <Accordion key={vehicle.route_type} TransitionProps={{ unmountOnExit: true }}>
              <AccordionSummary expandIcon={<ExpandMore />} id="{service.name}">
                <MyVisibility
                  shown={allRoutesOfTypeShown(vehicle.route_type)}
                  visibilityAction={() => hideRouteType(vehicle)}
                  visibilityOffAction={() => showRouteType(vehicle)}
                  label={vehicle.name}
                />
              </AccordionSummary>
              <AccordionDetails>
                {getRoutesOfType(vehicle.route_type).map((routes: Route[]) => (
                  <Accordion
                    key={routes[0].route_short_name}
                    TransitionProps={{ unmountOnExit: true }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <MyVisibility
                        shown={shownRoutes.includes(routes[0].route_id)}
                        visibilityAction={() => hideRoutes(routes)}
                        visibilityOffAction={() => showRoutes(routes)}
                        label={
                          <RoutePaper
                            text={routes[0].route_short_name}
                            id={routes[0].route_id}
                            color={routes[0].route_color}
                            textColor={routes[0].route_text_color}
                          />
                        }
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      {routes.map((route: Route, i) => (
                        <Accordion key={route.route_id + i}>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <>
                              <MyVisibility
                                shown={shownRoutes.includes(route.route_id!)}
                                visibilityAction={() => hideRoute(route)}
                                visibilityOffAction={() => showRoute(route)}
                                label={
                                  <RoutePaper
                                    text={route.route_short_name}
                                    id={route.route_id}
                                    color={route.route_color}
                                    textColor={route.route_text_color}
                                  />
                                }
                              />
                              <span>
                                {numberToDate(route.start_date)}
                                <br />
                                {numberToDate(route.end_date)}
                              </span>
                            </>
                          </AccordionSummary>
                          <AccordionDetails>
                            <RouteDetailComponent route={route} map={map} mapRef={mapRef} />
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
        <Grid item xs={9}>
          <Map ref={mapRef} map={map} />
        </Grid>
      </Grid>
    </>
  )
}

export default RoutesView
