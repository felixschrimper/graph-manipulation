import { Button, Grid, TextField } from "@mui/material"
import { useState } from "react"
import { Stop } from "../../Models/Stops"
import { TripStopTimeStop } from "../../Models/StopTimes"
import { MyAlert, StopSelector } from "../_Components/_Components"

interface Props {
  newStop: TripStopTimeStop
  setNewStop: (stop: TripStopTimeStop) => void
  saveNewStop: () => boolean
}

function AddTripNewStop(props: Props) {
  const [showError, setShowError] = useState<boolean>(false)

  return (
    <>
      <MyAlert
        showAlert={showError}
        setShowAlert={setShowError}
        message="Please add a stop. The arrival time must be after departure time of the previous stop."
        severity="error"
      />
      <Grid item xs={4}>
        <StopSelector
          stopId=""
          selectedNewStop={(stop: Stop) =>
            props.setNewStop({
              ...props.newStop,
              stop_id: stop.stop_id ?? "",
              stop_name: stop.stop_name ?? "",
            })
          }
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          error={props.newStop.arrival_time > props.newStop.departure_time}
          onChange={(e) => {
            props.setNewStop({
              ...props.newStop,
              arrival_time: e.target.value,
              departure_time: e.target.value,
            })
          }}
          value={props.newStop.arrival_time}
          label="Arrival Time"
          variant="outlined"
          type="time"
          className="searchBar"
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          onChange={(e) => {
            props.setNewStop({
              ...props.newStop,
              departure_time: e.target.value,
            })
          }}
          error={props.newStop.arrival_time > props.newStop.departure_time}
          value={props.newStop.departure_time}
          label="Departure Time"
          variant="outlined"
          type="time"
          className="searchBar"
          helperText={
            props.newStop.arrival_time > props.newStop.departure_time
              ? "Departure time must be after arrival time."
              : ""
          }
        />
      </Grid>
      <Grid item xs={4}>
        <Button
          variant="contained"
          onClick={() => {
            if (!props.saveNewStop()) {
              setShowError(true)
            }
          }}
        >
          Add Stop
        </Button>
      </Grid>
    </>
  )
}

export default AddTripNewStop
