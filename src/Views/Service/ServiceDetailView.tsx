import { Grid, Typography } from "@mui/material"
import { Link, useParams } from "react-router-dom"
import { decodeServiceIdUrl } from "../../Models/Calendars"
import { CalendarMode, ServiceDetailComponent } from "./ServiceDetailComponent"
import TripsView from "../Trip/TripsView"
import { CalendarMonth, Edit } from "@mui/icons-material"

function ServiceDetailView() {
  const { serviceId } = useParams()

  return (
    <Grid>
      <Grid container className="headlineContainer">
        <Typography variant="h3" className="iconTypography">
          <CalendarMonth fontSize="inherit" />
          Calendar
        </Typography>
        <Link to={"/editCalendar/" + serviceId!}>
          <Edit fontSize="large" />
        </Link>
      </Grid>
      <ServiceDetailComponent
        service_id={decodeServiceIdUrl(serviceId!)}
        mode={CalendarMode.showCalendar}
      />
      <TripsView serviceId={decodeServiceIdUrl(serviceId!)} />
    </Grid>
  )
}

export default ServiceDetailView
