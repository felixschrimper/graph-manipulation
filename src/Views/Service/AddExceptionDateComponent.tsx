import { Button, Grid, MenuItem, TextField } from "@mui/material"
import { useState } from "react"
import { CalendarDate, dateToNumber, numberToDate } from "../../Models/CalendarDates"

interface Props {
  service_id: string
  addNewDate: (date: CalendarDate) => void
}

function AddExceptionDateComponent(props: Props) {
  const [newCalendarDate, setNewCalendarDate] = useState<CalendarDate>({
    id: 0,
    service_id: props.service_id,
    date: 20220615,
    exception_type: 1,
  })

  return (
    <>
      <Grid item xs={4}>
        <TextField
          onChange={(e) => {
            setNewCalendarDate({
              ...newCalendarDate,
              date: dateToNumber(e.target.value),
            })
          }}
          value={numberToDate(newCalendarDate.date)}
          label="Exception date"
          variant="outlined"
          type="date"
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          value={newCalendarDate.exception_type}
          onChange={(e) => {
            const value = parseInt(e.target.value)
            setNewCalendarDate({
              ...newCalendarDate,
              exception_type: value,
            })
          }}
          label="Exception Type"
          select
          style={{ width: "50%" }}
        >
          <MenuItem value={1}>1 - add Date</MenuItem>
          <MenuItem value={2}>2 - remove Date</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={4}>
        <Button
          variant="contained"
          onClick={() => {
            props.addNewDate(newCalendarDate)
            setNewCalendarDate({
              id: 0,
              service_id: props.service_id,
              date: 20220615,
              exception_type: 1,
            })
          }}
        >
          Add Exception Date
        </Button>
      </Grid>
    </>
  )
}
export default AddExceptionDateComponent
