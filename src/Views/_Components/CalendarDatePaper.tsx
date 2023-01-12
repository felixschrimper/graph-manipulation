import { Close } from "@mui/icons-material"
import { IconButton, Paper } from "@mui/material"
import { CalendarDate, numberToDate } from "../../Models/CalendarDates"

interface Props {
  calendarDate: CalendarDate
  removeCalendarDate: (date: CalendarDate) => void
  custom: boolean
}

function CalendarDatePaper(props: Props) {
  return (
    <Paper
      component="span"
      sx={{
        backgroundColor: props.calendarDate.exception_type === 1 ? "green" : "red",
        mr: 2,
        mb: 1,
        padding: 1,
        display: "inline-block",
        verticalAlign: "center",
      }}
      key={props.calendarDate.date}
    >
      {numberToDate(props.calendarDate.date)}
      {props.custom ? (
        <IconButton onClick={() => props.removeCalendarDate(props.calendarDate)}>
          <Close />
        </IconButton>
      ) : null}
    </Paper>
  )
}
export default CalendarDatePaper
