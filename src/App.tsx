import { Box, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { Route, Routes, BrowserRouter as Router } from "react-router-dom"
import { Stop } from "./Models/Stops"
import { Route as TrafficRoute } from "./Models/Routes"
import { AppDispatch, RootState } from "./State/_Store"
import { Loading, MyAppBar } from "./Views/_Components/_Components"
import { Shapes } from "./Models/Shapes"
import { useEffect } from "react"
import { fetchShapes } from "./State/Shapes"
import { fetchRoutes } from "./State/Routes"
import { fetchStops } from "./State/Stops"
import { LoadingStatus } from "./Service/LoadingStatus"
import RoutesView from "./Views/Route/RoutesView"
import RouteDetailView from "./Views/Route/RouteDetailView"
import SettingsView from "./Views/Settings/SettingsView"
import AddStopView from "./Views/Stop/AddStopView"
import StopDetailView from "./Views/Stop/StopDetailView"
import StopsView from "./Views/Stop/StopsView"
import AddRouteView from "./Views/Route/AddRouteView"
import { Calendar } from "./Models/Calendars"
import { fetchCalendars } from "./State/Calendars"
import { CalendarDate } from "./Models/CalendarDates"
import { fetchCalendarDates } from "./State/CalendarDates"
import TripsDetailView from "./Views/Trip/TripsDetailView"
import ServiceDetailView from "./Views/Service/ServiceDetailView"
import AddTripView from "./Views/Trip/AddTripView"
import EditServiceView from "./Views/Service/EditServiceView"

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const calendarDates: {
    status: LoadingStatus
    calendarDates: CalendarDate[]
  } = useSelector((state: RootState) => state.calendarDates)
  const calendars: { status: LoadingStatus; calendars: Calendar[] } = useSelector(
    (state: RootState) => state.calendars,
  )
  const routes: { status: LoadingStatus; routes: TrafficRoute[] } = useSelector(
    (state: RootState) => state.routes,
  )
  const shapes: { status: LoadingStatus; shapes: Shapes } = useSelector(
    (state: RootState) => state.shapes,
  )
  const stops: { status: LoadingStatus; stops: Stop[] } = useSelector(
    (state: RootState) => state.stops,
  )

  useEffect(() => {
    if (calendarDates.status === LoadingStatus.idle) {
      dispatch(fetchCalendarDates())
    }
    if (calendars.status === LoadingStatus.idle) {
      dispatch(fetchCalendars())
    }
    if (routes.status === LoadingStatus.idle) {
      dispatch(fetchRoutes())
    }
    if (shapes.status === LoadingStatus.idle) {
      dispatch(fetchShapes())
    }
    if (stops.status === LoadingStatus.idle) {
      dispatch(fetchStops())
    }
  }, [])

  function loadingStatus(): LoadingStatus {
    if (
      calendarDates.status === LoadingStatus.succeeded &&
      calendars.status === LoadingStatus.succeeded &&
      shapes.status === LoadingStatus.succeeded &&
      routes.status === LoadingStatus.succeeded &&
      stops.status === LoadingStatus.succeeded
    ) {
      return LoadingStatus.succeeded
    } else if (
      calendarDates.status === LoadingStatus.failed ||
      calendars.status === LoadingStatus.failed ||
      shapes.status === LoadingStatus.failed ||
      routes.status === LoadingStatus.failed ||
      stops.status === LoadingStatus.failed
    ) {
      return LoadingStatus.failed
    }
    return LoadingStatus.loading
  }

  return (
    <>
      <Router>
        <MyAppBar />
        <Box className="main">
          {loadingStatus() === LoadingStatus.succeeded ? (
            <Routes>
              <Route path="/" element={<RoutesView />} />
              <Route path="/routes" element={<RoutesView />} />
              <Route path="/stop/:stopId" element={<StopDetailView />} />
              <Route path="/stops" element={<StopsView />} />
              <Route path="/addStop/" element={<AddStopView />} />
              <Route path="/editStop/:stopId" element={<AddStopView />} />
              <Route path="/route/:routeId" element={<RouteDetailView />} />
              <Route path="/addRoute/" element={<AddRouteView />} />
              <Route path="/editRoute/:routeId" element={<AddRouteView />} />
              <Route path="/trips" element={<TripsDetailView />} />
              <Route path="/trip/:tripId" element={<TripsDetailView />} />
              <Route path="/addTrip/" element={<AddTripView />} />
              <Route path="/editTrip/:tripId" element={<AddTripView />} />
              <Route path="/editTrip" element={<AddTripView />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="/calendar/:serviceId" element={<ServiceDetailView />} />
              <Route path="/editCalendar/:serviceId" element={<EditServiceView />} />
            </Routes>
          ) : loadingStatus() === LoadingStatus.failed ? (
            <Routes>
              <Route
                path="*"
                element={
                  <Typography>
                    Failed to load. Go to Settings and import a valid GTFS file.
                    <br />
                    If you have just fetched GTFS data and still see this error, please reload the
                    page.
                  </Typography>
                }
              />

              <Route path="/settings" element={<SettingsView />} />
            </Routes>
          ) : (
            <Loading
              text={
                "Loading status: " +
                "\n CalendarDates: " +
                calendarDates.status +
                "\n Calendars: " +
                calendars.status +
                "\n Routes: " +
                routes.status +
                "\n Shapes: " +
                shapes.status +
                "\n Stops: " +
                stops.status
              }
            />
          )}
        </Box>
      </Router>
    </>
  )
}

export default App
