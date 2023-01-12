import { Checkbox, Grid, Popover, Typography } from "@mui/material"
import { useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { CalendarDate, numberToDate } from "../../Models/CalendarDates"
import { Calendar, encodeServiceIdUrl } from "../../Models/Calendars"
import { RootState } from "../../State/_Store"

interface Props {
  serviceId: string
}

function CalendarSummaryPopup(props: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const calendar: Calendar | undefined = useSelector((state: RootState) =>
    state.calendars.calendars.find((calendar) => calendar.service_id === props.serviceId),
  )

  const calendarDates: CalendarDate[] = useSelector((state: RootState) =>
    state.calendarDates.calendarDates.filter(
      (calendarDate) => calendarDate.service_id === props.serviceId,
    ),
  )

  return (
    <>
      <Typography
        onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
        onMouseLeave={() => setAnchorEl(null)}
      >
        Service Id:{" "}
        <Link to={"/calendar/" + encodeServiceIdUrl(props.serviceId)}>
          <b>{props.serviceId}</b>
        </Link>
      </Typography>
      <Popover
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={() => setAnchorEl(null)}
        disableRestoreFocus
      >
        <Grid container m={2}>
          <Grid item xs={12}>
            {calendar
              ? numberToDate(calendar.start_date) + " - " + numberToDate(calendar.end_date)
              : null}
          </Grid>
          <Grid item xs={12}>
            <Checkbox checked={calendar?.monday === 1} disabled={true} />
            <Checkbox checked={calendar?.tuesday === 1} disabled={true} />
            <Checkbox checked={calendar?.wednesday === 1} disabled={true} />
            <Checkbox checked={calendar?.thursday === 1} disabled={true} />
            <Checkbox checked={calendar?.friday === 1} disabled={true} sx={{ mr: 2 }} />
            <Checkbox checked={calendar?.saturday === 1} disabled={true} />
            <Checkbox checked={calendar?.sunday === 1} disabled={true} />
          </Grid>
          <Grid item xs={12}>
            {calendarDates.length + " exceptions"}
          </Grid>
        </Grid>
      </Popover>
    </>
  )
}
export default CalendarSummaryPopup
