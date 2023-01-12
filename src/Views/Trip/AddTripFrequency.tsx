import { FormControlLabel, Grid, InputAdornment, Switch, TextField } from "@mui/material"
import { Frequency } from "../../Models/StopTimes"

interface Props {
  frequency: Frequency
  setFrequency: (frequency: Frequency) => void
}

function AddTripFrequency(props: Props) {
  return (
    <>
      <Grid item xs={2}>
        <FormControlLabel
          control={
            <Switch
              checked={props.frequency.on}
              onChange={(e) => props.setFrequency({ ...props.frequency, on: e.target.checked })}
            />
          }
          label="Frequency"
        />
      </Grid>
      {props.frequency.on ? (
        <>
          <Grid item xs={2}>
            <TextField
              onChange={(e) => {
                props.setFrequency({ ...props.frequency, timeInterval: parseInt(e.target.value) })
              }}
              value={props.frequency.timeInterval}
              type="number"
              label="Frequency"
              variant="outlined"
              className="searchBar"
              InputProps={{
                endAdornment: <InputAdornment position="end">Minutes</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              onChange={(e) => {
                props.setFrequency({ ...props.frequency, endTime: e.target.value })
              }}
              value={props.frequency.endTime}
              label="End Time"
              variant="outlined"
              type="time"
              className="searchBar"
            />
          </Grid>
          <Grid item xs={4}></Grid>
        </>
      ) : null}
    </>
  )
}
export default AddTripFrequency
