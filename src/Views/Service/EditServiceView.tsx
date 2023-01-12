import { Grid, Typography } from "@mui/material"
import { useParams } from "react-router-dom"
import { decodeServiceIdUrl } from "../../Models/Calendars"
import { CalendarMode, ServiceDetailComponent } from "./ServiceDetailComponent"
import { Edit } from "@mui/icons-material"

function EditServiceView() {
  const { serviceId } = useParams()

  return (
    <Grid>
      <Grid container className="headlineContainer">
        <Typography variant="h3" className="iconTypography">
          <Edit fontSize="inherit" />
          Edit Calendar
        </Typography>
      </Grid>
      <ServiceDetailComponent
        service_id={decodeServiceIdUrl(serviceId!)}
        mode={CalendarMode.editCalendar}
      />
    </Grid>
  )
}

export default EditServiceView
